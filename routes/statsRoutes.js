const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Restaurants = require('../models/Restaurants');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

// Get platform statistics
router.get('/platform-stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const restaurantCount = await Restaurants.countDocuments();
        const reviewCount = await Review.countDocuments();
        const couponCount = await Coupon.countDocuments();

        res.json({
            success: true,
            stats: {
                users: userCount,
                restaurants: restaurantCount,
                reviews: reviewCount,
                coupons: couponCount
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch platform statistics'
        });
    }
});

module.exports = router;
