const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurants'); 
const User = require('../models/User'); // Import User model to get the name
const { Client } = require("@googlemaps/google-maps-services-js");
const axios = require('axios');
const auth = require('../middleware/auth');
const client = new Client({});

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

router.get('/search', async (req, res) => {
    try {
        const { name, city } = req.query;
        let query = {};

        if (city && city.trim() !== "") {
            query.city = { $regex: `^${city}$`, $options: 'i' }; 
        }

        if (name && name.trim() !== "") {
            query.name = { $regex: name, $options: 'i' };
        }

        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
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
        const { googleMapsLink } = req.body; // Removed 'city' from req.body
        
        if (!googleMapsLink) {
            return res.status(400).json({ message: "Google Maps link is required." });
        }

        // A. Resolve shortened URL
        const resolveResponse = await axios.get(googleMapsLink, { 
            maxRedirects: 5,
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        const longUrl = resolveResponse.request.res.responseUrl;

        // B. Extract Name from URL
        const namePart = longUrl.split('/place/')[1]?.split('/')[0];
        const restaurantName = decodeURIComponent(namePart || '').replace(/\+/g, ' ');

        if (!restaurantName) {
            return res.status(400).json({ message: "Could not detect restaurant name from link." });
        }

        // C. Fetch Data from Google Places API
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

        // D. AUTO-DETECT CITY FROM ADDRESS
        const detectedCity = detectCity(place.formatted_address);
        if (!detectedCity) {
            return res.status(400).json({ 
                message: "This restaurant is outside our supported cities (Islamabad, Rawalpindi, Lahore, Karachi)." 
            });
        }

        // E. GET LOGGED-IN USER NAME
        // req.user.id is available thanks to your 'auth' middleware
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found." });

        // F. Construct Photo URL
        let photoUrl = 'assets/default-restaurant.jpg'; 
        if (place.photos && place.photos.length > 0) {
            const photoReference = place.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        }

        // G. Save to MongoDB with Attribution
        const newRestaurant = new Restaurant({
            name: place.name,
            location: place.formatted_address,
            description: `A top-rated spot in ${detectedCity}, added by our community.`,
            city: detectedCity,
            imageUrl: photoUrl,
            addedBy: {
                userId: user._id,
                userName: user.name // Using the name from your User model
            },
            averageRating: null, 
            reviewCount: 0
        });

        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);

    } catch (err) {
        console.error("GOOGLE ADD ERROR:", err.message);
        res.status(500).json({ 
            message: "Failed to process Google Maps link.",
            error: err.message 
        });
    }
});

module.exports = router;