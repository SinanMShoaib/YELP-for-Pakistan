const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurants'); 
const User = require('../models/User'); 
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
    if (addressLower.includes('rawalpindi') || addressLower.includes('pindi')) return 'rawalpindi';
    return null; 
};

// --- 1. SEARCH & GET ROUTES ---
router.get('/search', async (req, res) => {
    try {
        const { name, city, price, category, amenity } = req.query;
        let query = { status: 'Approved' };
        if (city && city.trim() !== "") query.city = { $regex: `^${city}$`, $options: 'i' }; 
        if (name && name.trim() !== "") query.name = { $regex: name, $options: 'i' };
        if (price) query.priceRange = price;
        if (category) query.categories = { $in: [category] };
        if (amenity) query.amenities = { $in: [amenity] };
        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const topContributors = await User.find({ fitHaeTokens: { $gt: 0 } })
            .sort({ fitHaeTokens: -1 }).limit(10).select('username fitHaeTokens profileImage');
        res.json(topContributors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ message: 'Invalid ID format' });
    }
});

// --- 2. ONBOARDING ---
router.post('/add', auth, async (req, res) => {
    try {
        const { googleMapsLink, manualData } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found." });

        let restaurantData = {};
        if (googleMapsLink) {
            const resolveResponse = await axios.get(googleMapsLink, { maxRedirects: 5, headers: { 'User-Agent': 'Mozilla/5.0' } });
            const longUrl = resolveResponse.request.res.responseUrl;
            const namePart = longUrl.split('/place/')[1]?.split('/')[0];
            const restaurantName = decodeURIComponent(namePart || '').replace(/\+/g, ' ');
            if (!restaurantName) return res.status(400).json({ message: "Could not detect restaurant name." });

            const googleSearch = await client.findPlaceFromText({
                params: { input: restaurantName, inputtype: 'textquery', fields: ['name', 'formatted_address', 'photos'], key: process.env.GOOGLE_MAPS_API_KEY }
            });
            const place = googleSearch.data.candidates[0];
            if (!place) return res.status(404).json({ message: "No matching restaurant found." });

            const detectedCity = detectCity(place.formatted_address);
            if (!detectedCity) return res.status(400).json({ message: "City not supported." });

            let photoUrl = 'assets/default-restaurant.jpg'; 
            if (place.photos && place.photos.length > 0) {
                photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
            }

            restaurantData = { name: place.name, location: place.formatted_address, city: detectedCity, imageUrl: photoUrl, description: `A top-rated spot in ${detectedCity}.` };
        } else if (manualData) {
            restaurantData = { name: manualData.name, location: manualData.location, city: manualData.city.toLowerCase(), imageUrl: manualData.imageUrl || 'assets/default-restaurant.jpg', description: manualData.description || `A new discovery.` };
        }

        const newRestaurant = new Restaurant({ ...restaurantData, addedBy: { userId: user._id, userName: user.username || user.name }, status: 'Pending Review' });
        await newRestaurant.save();
        res.status(201).json({ message: "Submission received! Admin will review soon." });
    } catch (err) {
        res.status(500).json({ message: "Failed to process submission.", error: err.message });
    }
});

router.get('/user/submissions', auth, async (req, res) => {
    try {
        const submissions = await Restaurant.find({ 'addedBy.userId': req.user.id }).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 3. ADMIN ---
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') next();
        else res.status(403).json({ message: "Access denied. Admin only." });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

router.get('/admin/pending', auth, isAdmin, async (req, res) => {
    try {
        const pendingRestaurants = await Restaurant.find({ status: 'Pending Review' });
        res.json(pendingRestaurants);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch('/:id/verify', auth, isAdmin, async (req, res) => {
    try {
        const { action } = req.body; 
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        if (action === 'approve') {
            restaurant.status = 'Approved';
            await restaurant.save();
            if (restaurant.addedBy?.userId) await User.findByIdAndUpdate(restaurant.addedBy.userId, { $inc: { fitHaeTokens: 1 } });
            res.json({ message: "Restaurant approved." });
        } else {
            restaurant.status = 'Rejected';
            await restaurant.save();
            res.json({ message: "Restaurant rejected." });
        }
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET Branded Review Card with QR Code
router.get('/:id/qr', auth, isAdmin, async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

        const reviewUrl = `https://fithae.com/restaurant/${restaurant._id}`; 
        const qrDataUrl = await QRCode.toDataURL(reviewUrl, { margin: 1, width: 300 });

        const width = 600;
        const height = 900;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // LOAD LUXURY BACKGROUND
        try {
            const bg = await loadImage('assets/luxury-bg.png');
            ctx.drawImage(bg, 0, 0, width, height);
        } catch (e) {
            ctx.fillStyle = '#0f0f0f';
            ctx.fillRect(0, 0, width, height);
        }

        // GLASS OVERLAY
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, width, height);

        // GOLDEN FRAME
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 20;
        ctx.strokeRect(20, 20, width - 40, height - 40);

        // SHADOW HELPER
        const drawText = (text, x, y, font, color) => {
            ctx.textAlign = 'center';
            ctx.font = font;
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 10;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0;
        };

        drawText('FitHae', width / 2, 100, 'bold 60px Arial', '#ffffff');
        drawText('OFFICIAL REVIEW CARD', width / 2, 140, 'bold 18px Arial', '#d4af37');

        // Restaurant Name
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(50, 180, width - 100, 120);
        drawText(restaurant.name.toUpperCase(), width / 2, 255, 'bold 36px Arial', '#ffffff');

        // QR Background
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(width / 2 - 160, 340, 320, 320, 30);
        ctx.fill();

        const qrImage = await loadImage(qrDataUrl);
        ctx.drawImage(qrImage, width / 2 - 150, 350, 300, 300);

        drawText('SCAN TO RATE & REVIEW', width / 2, 730, 'bold 24px Arial', '#ffffff');
        drawText('Fit Hai Boss!', width / 2, 830, 'italic bold 32px Arial', '#d32f2f');

        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (err) { res.status(500).json({ message: "Failed to generate QR card." }); }
});

module.exports = router;