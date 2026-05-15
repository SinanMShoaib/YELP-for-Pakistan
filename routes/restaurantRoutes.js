const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurants'); 
const User = require('../models/User'); // Import User model to get the name
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require('axios');
const auth = require('../middleware/auth');
const client = new Client({});
const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

// --- HELPER: AUTO-DETECT CITY (LOWERCASE) ---
const detectCity = (address) => {
    const addressLower = address.toLowerCase();
    
    if (addressLower.includes('islamabad')) return 'islamabad';
    if (addressLower.includes('lahore')) return 'lahore';
    if (addressLower.includes('karachi')) return 'karachi';
    // Handle both 'pindi' and 'rawalpindi'
    if (addressLower.includes('rawalpindi') || addressLower.includes('pindi')) {
        return 'rawalpindi';
    }
    
    return null; 
};

// --- 1. SEARCH & GET ROUTES ---

// --- 1. SEARCH & GET ROUTES ---

router.get('/search', async (req, res) => {
    try {
        const { name, city, price, category, amenity } = req.query;
        // Only return approved restaurants for public search
        let query = { status: 'Approved' };

        if (city && city.trim() !== "") {
            query.city = { $regex: `^${city}$`, $options: 'i' }; 
        }

        if (name && name.trim() !== "") {
            query.name = { $regex: name, $options: 'i' };
        }

        if (price) {
            query.priceRange = price;
        }

        if (category) {
            query.categories = { $in: [category] };
        }

        if (amenity) {
            query.amenities = { $in: [amenity] };
        }

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const topContributors = await User.find({ fitHaeTokens: { $gt: 0 } })
            .sort({ fitHaeTokens: -1 })
            .limit(10)
            .select('username fitHaeTokens profileImage');
        res.json(topContributors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ message: 'Invalid ID format' });
    }
});

// --- 2. GOOGLE MAPS ONBOARDING ROUTE ---

router.post('/add', auth, async (req, res) => {
    try {
        const { googleMapsLink } = req.body;
        
        if (!googleMapsLink) {
            return res.status(400).json({ message: "Google Maps link is required." });
        }

        const resolveResponse = await axios.get(googleMapsLink, { 
            maxRedirects: 5,
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        const longUrl = resolveResponse.request.res.responseUrl;

        const namePart = longUrl.split('/place/')[1]?.split('/')[0];
        const restaurantName = decodeURIComponent(namePart || '').replace(/\+/g, ' ');

        if (!restaurantName) {
            return res.status(400).json({ message: "Could not detect restaurant name from link." });
        }

        const googleSearch = await client.findPlaceFromText({
            params: {
                input: restaurantName,
                inputtype: 'textquery',
                fields: ['name', 'formatted_address', 'photos'],
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        const place = googleSearch.data.candidates[0];
        if (!place) {
            return res.status(404).json({ message: "No matching restaurant found on Google Maps." });
        }

        const detectedCity = detectCity(place.formatted_address);
        if (!detectedCity) {
            return res.status(400).json({ 
                message: "This restaurant is outside our supported cities (Islamabad, Rawalpindi, Lahore, Karachi)." 
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found." });

        let photoUrl = 'assets/default-restaurant.jpg'; 
        if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        }

        const newRestaurant = new Restaurant({
            name: place.name,
            location: place.formatted_address,
            description: `A top-rated spot in ${detectedCity}, added by our community.`,
            city: detectedCity,
            imageUrl: photoUrl,
            addedBy: {
                userId: user._id,
                userName: user.username || user.name
            },
            status: 'Pending Review'
        });

        const savedRestaurant = await newRestaurant.save();
        res.status(201).json({ 
            message: "Your restaurant submission has been received. It will be added shortly after our admin reviews and approves it.", 
            restaurant: savedRestaurant 
        });

    } catch (err) {
        console.error("GOOGLE ADD ERROR:", err.message);
        res.status(500).json({ 
            message: "Failed to process Google Maps link.",
            error: err.message 
        });
    }
});

// GET user's restaurant submissions
router.get('/user/submissions', auth, async (req, res) => {
    try {
        const submissions = await Restaurant.find({ 'addedBy.userId': req.user.id })
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 3. ADMIN ROUTES ---

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admin only." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET all unverified restaurants (Admin only)
router.get('/admin/pending', auth, isAdmin, async (req, res) => {
    try {
        const pendingRestaurants = await Restaurant.find({ status: 'Pending Review' });
        res.json(pendingRestaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH to verify or reject a restaurant (Admin only)
router.patch('/:id/verify', auth, isAdmin, async (req, res) => {
    try {
        const { action } = req.body; 
        const restaurantId = req.params.id;

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        if (action === 'approve') {
            restaurant.status = 'Approved';
            await restaurant.save();

            // Award 1 FitHae Token to the contributor
            if (restaurant.addedBy && restaurant.addedBy.userId) {
                await User.findByIdAndUpdate(restaurant.addedBy.userId, { $inc: { fitHaeTokens: 1 } });
            }

            res.json({ message: "Restaurant approved. 1 FitHae Token awarded to contributor.", restaurant });
        } else if (action === 'reject') {
            restaurant.status = 'Rejected';
            await restaurant.save();
            res.json({ message: "Restaurant rejected." });
        } else {
            res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'." });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Branded Review Card with QR Code
router.get('/:id/qr', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        const reviewUrl = `https://fithae.com/restaurant/${restaurant._id}`; // Base URL should be dynamic in prod
        
        // Generate QR Code
        const qrDataUrl = await QRCode.toDataURL(reviewUrl, { margin: 1, width: 200 });

        // Create a Branded Card using Canvas
        const width = 400;
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(0, 0, width, height);

        // Border
        ctx.strokeStyle = '#d32f2f';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, width - 10, height - 10);

        // Header Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FitHae', width / 2, 60);

        ctx.fillStyle = '#d32f2f';
        ctx.font = '24px Arial';
        ctx.fillText('Review Card', width / 2, 95);

        // Restaurant Name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(restaurant.name, width / 2, 160);

        // QR Code
        const qrImage = await loadImage(qrDataUrl);
        ctx.drawImage(qrImage, width / 2 - 100, 200, 200, 200);

        // Footer Text
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '16px Arial';
        ctx.fillText('Scan to Rate & Review', width / 2, 430);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'italic 18px Arial';
        ctx.fillText('Fit Hai Boss!', width / 2, 530);

        // Stream the result
        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);

    } catch (err) {
        console.error("QR GEN ERROR:", err);
        res.status(500).json({ message: "Failed to generate QR card." });
    }
});

module.exports = router;