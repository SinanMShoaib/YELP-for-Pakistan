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

        const width = 1200; 
        const height = 600;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // LOAD LUXURY BACKGROUND
        try {
            const bg = await loadImage('assets/luxury-bg.png');
            ctx.drawImage(bg, 0, 0, width, height);
        } catch (e) {
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#0f0f0f');
            grad.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
        }

        // GLASS OVERLAY
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);

        // GOLDEN FRAME
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 25;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        // SHADOW HELPER
        const drawTextWithShadow = (text, x, y, font, color, align = 'center') => {
            ctx.textAlign = align;
            ctx.font = font;
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 20;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
            ctx.shadowBlur = 0; 
        };

        // BRANDING
        drawTextWithShadow('FitHae', 100, 140, 'bold 80px Arial', '#ffffff', 'left');
        drawTextWithShadow('PRIVILEGE PASS', 100, 190, 'bold 28px Arial', '#d4af37', 'left');

        // DISCOUNT
        drawTextWithShadow('15% OFF', width - 100, 200, 'bold 140px Arial', '#ffffff', 'right');

        // HOLDER INFO
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(100, 270, width - 200, 160);
        
        drawTextWithShadow('PASS HOLDER', 130, 315, 'bold 24px Arial', '#d4af37', 'left');
        drawTextWithShadow(coupon.userId.name.toUpperCase(), 130, 385, 'bold 55px Arial', '#ffffff', 'left');

        // VOUCHER ID
        drawTextWithShadow('VOUCHER ID', width - 130, 315, 'bold 24px Arial', '#d4af37', 'right');
        drawTextWithShadow(coupon.couponId, width - 130, 385, 'bold 45px Arial', '#ffffff', 'right');

        // FOOTER
        drawTextWithShadow('Redeemable at any Partner Restaurant • Fit Hai Boss!', width / 2, 520, 'italic bold 32px Arial', '#ffffff');
        drawTextWithShadow('Valid through: ' + coupon.expiryDate.toDateString(), width / 2, 560, '18px Arial', 'rgba(255,255,255,0.6)');

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
