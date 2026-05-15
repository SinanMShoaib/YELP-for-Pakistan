const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// REDEEM a coupon
router.post('/redeem', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.fitHaeTokens < 1) {
            return res.status(400).json({ message: "Insufficient FitHae Tokens. You need at least 1 token to redeem a coupon." });
        }

        // Deduct 1 token
        user.fitHaeTokens -= 1;
        await user.save();

        // Generate a unique Coupon ID
        const couponId = `FITHAE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        
        const newCoupon = new Coupon({
            couponId,
            userId: user._id,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });

        await newCoupon.save();

        res.json({ 
            message: "Coupon redeemed successfully!", 
            coupon: newCoupon,
            remainingTokens: user.fitHaeTokens
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// VERIFY a coupon
router.get('/verify/:couponId', async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ couponId: req.params.couponId.toUpperCase() })
            .populate('userId', 'name username');

        if (!coupon) {
            return res.status(404).json({ message: "Invalid Coupon ID. This coupon does not exist." });
        }

        if (coupon.status !== 'Active') {
            return res.status(400).json({ message: `This coupon is already ${coupon.status.toLowerCase()}.` });
        }

        if (coupon.expiryDate && new Date() > coupon.expiryDate) {
            coupon.status = 'Expired';
            await coupon.save();
            return res.status(400).json({ message: "This coupon has expired." });
        }

        res.json({ 
            valid: true, 
            message: "Valid FitHae Coupon!", 
            coupon 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
