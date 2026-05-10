const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurants');
const User = require('../models/User'); // Import User model
const auth = require('../middleware/auth'); // Import auth middleware

// POST a new review
router.post('/add', auth, async (req, res) => {
    try {
        const { restaurantId, comment, rating } = req.body;

        // 1. Fetch the user's name from the DB using the ID from the token
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Save the new review with automatic attribution
        const newReview = new Review({ 
            restaurantId, 
            userId: user._id,
            userName: user.name, // Automatic name retrieval
            comment, 
            rating 
        });
        await newReview.save();

        // 3. Recalculate average for this restaurant
        const reviews = await Review.find({ restaurantId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        // 4. Update the Restaurant document
        await Restaurant.findByIdAndUpdate(restaurantId, { 
            averageRating: parseFloat(avgRating.toFixed(1)), // Ensure it stays a number
            reviewCount: reviews.length 
        });

        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all reviews for a specific restaurant
router.get('/:restaurantId', async (req, res) => {
    try {
        const reviews = await Review.find({ restaurantId: req.params.restaurantId }).sort({ date: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;