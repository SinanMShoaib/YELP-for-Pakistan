const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const { createCanvas, loadImage } = require('canvas');

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

// GET Downloadable Professional Coupon
router.get('/download/:couponId', auth, async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ couponId: req.params.couponId.toUpperCase(), userId: req.user.id })
            .populate('userId', 'name');
            
        if (!coupon) return res.status(404).json({ message: "Coupon not found or unauthorized." });

        const width = 800;
        const height = 400;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // LUXURY BACKGROUND
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0a0a0a');
        grad.addColorStop(0.5, '#1a1a1a');
        grad.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // GOLDEN BORDER
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 15;
        ctx.strokeRect(20, 20, width - 40, height - 40);
        
        // INNER GLOW BORDER
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 35, width - 70, height - 70);

        // BRANDING
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('FitHae', 60, 100);
        
        ctx.fillStyle = '#d4af37';
        ctx.font = '700 20px sans-serif';
        ctx.fillText('PRIVILEGE PASS', 60, 135);

        // DISCOUNT MAIN TEXT
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 90px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('15% OFF', width - 60, 140);

        // USER NAME SECTION
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(60, 180, width - 120, 100);
        
        ctx.fillStyle = '#d4af37';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('PASS HOLDER', 80, 210);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText(coupon.userId.name.toUpperCase(), 80, 250);

        // VOUCHER DETAILS
        ctx.fillStyle = '#888888';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('VOUCHER ID', width - 80, 210);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(coupon.couponId, width - 80, 250);

        // FOOTER
        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.font = 'italic 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Redeemable at any FitHae partner restaurant. Valid for 30 days.', width/2, 340);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('Fit Hai Boss!', width/2, 370);

        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', `attachment; filename=FitHae_Coupon_${coupon.couponId}.png`);
        res.send(buffer);

    } catch (err) {
        console.error("COUPON GEN ERROR:", err);
        res.status(500).json({ message: "Failed to generate coupon asset." });
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
