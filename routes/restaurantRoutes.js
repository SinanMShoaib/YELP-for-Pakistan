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

        // Solid dark background (no external image dependency)
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, width, height);

        // Subtle gradient overlay
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(20, 20, 40, 0.8)');
        grad.addColorStop(1, 'rgba(10, 10, 10, 0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // GOLDEN FRAME
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 16;
        ctx.strokeRect(24, 24, width - 48, height - 48);

        // Inner thin gold line
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(44, 44, width - 88, height - 88);

        // Safe text helper - uses only 'sans-serif' generic family
        const drawText = (text, x, y, size, color, bold = true) => {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = (bold ? 'bold ' : '') + size + 'px sans-serif';
            // Text shadow for readability
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillText(text, x + 2, y + 2);
            // Actual text
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
        };

        // Brand name
        drawText('FitHae', width / 2, 100, 56, '#ffffff');
        drawText('OFFICIAL REVIEW CARD', width / 2, 150, 16, '#d4af37');

        // Decorative line under header
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 100, 175);
        ctx.lineTo(width / 2 + 100, 175);
        ctx.stroke();

        // Restaurant Name Box
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(60, 195, width - 120, 80);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 195, width - 120, 80);
        
        const rName = restaurant.name.toUpperCase();
        const nameSize = rName.length > 20 ? 24 : 32;
        drawText(rName, width / 2, 235, nameSize, '#ffffff');

        // QR Code white background (simple rect, no roundRect)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width / 2 - 160, 310, 320, 320);

        const qrImage = await loadImage(qrDataUrl);
        ctx.drawImage(qrImage, width / 2 - 150, 320, 300, 300);

        // Bottom text
        drawText('SCAN TO RATE & REVIEW', width / 2, 690, 22, '#ffffff');

        // Decorative line
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 120, 720);
        ctx.lineTo(width / 2 + 120, 720);
        ctx.stroke();

        drawText('Powered by FitHae', width / 2, 760, 14, 'rgba(255,255,255,0.4)', false);
        drawText('Fit Hai Boss!', width / 2, 830, 30, '#ef4444');

        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (err) { 
        console.error("QR CARD ERROR:", err);
        res.status(500).json({ message: "Failed to generate QR card." }); 
    }
});

module.exports = router;