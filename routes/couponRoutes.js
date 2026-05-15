const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');
const { createCanvas } = require('canvas');

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

function fillRoundRect(ctx, x, y, width, height, radius, fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

// GET Downloadable Professional Coupon (Boarding Pass Style)
router.get('/download/:couponId', auth, async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ couponId: req.params.couponId.toUpperCase(), userId: req.user.id })
            .populate('userId', 'name');
            
        if (!coupon) return res.status(404).json({ message: "Coupon not found or unauthorized." });

        const width = 1200; 
        const height = 450;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Background (light grey to make the white ticket pop)
        ctx.fillStyle = '#f0f2f5';
        ctx.fillRect(0, 0, width, height);

        // Ticket dimensions
        const tx = 50;
        const ty = 50;
        const tw = 1100;
        const th = 350;
        const splitX = 850; // Where the stub separates

        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;
        fillRoundRect(ctx, tx, ty, tw, th, 20, '#ffffff');
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Top Header (Blue)
        const headerH = 70;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tx + 20, ty);
        ctx.lineTo(tx + tw - 20, ty);
        ctx.quadraticCurveTo(tx + tw, ty, tx + tw, ty + 20);
        ctx.lineTo(tx + tw, ty + headerH);
        ctx.lineTo(tx, ty + headerH);
        ctx.lineTo(tx, ty + 20);
        ctx.quadraticCurveTo(tx, ty, tx + 20, ty);
        ctx.closePath();
        ctx.fillStyle = '#4A90E2';
        ctx.fill();
        ctx.restore();

        // Header Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('FITHAE PRIVILEGES', tx + 30, ty + 45);

        ctx.font = 'bold 24px Arial';
        ctx.fillText('BOARDING PASS', tx + 550, ty + 45);

        // Stub Header Text
        ctx.fillText('BOARDING PASS', splitX + 20, ty + 45);

        // Dashed line separator
        ctx.beginPath();
        ctx.setLineDash([10, 10]);
        ctx.moveTo(splitX, ty);
        ctx.lineTo(splitX, ty + th);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Helper for label and value
        const drawField = (label, value, x, y, valFont = 'bold 28px Arial') => {
            ctx.fillStyle = '#888888';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(label, x, y);
            
            ctx.fillStyle = '#333333';
            ctx.font = valFont;
            ctx.fillText(value, x, y + 35);
        };

        // --- Left Section (Main) ---
        drawField('PASS HOLDER', coupon.userId.name.toUpperCase(), tx + 40, ty + 120, 'bold 32px Arial');
        drawField('VOUCHER ID', coupon.couponId, tx + 40, ty + 210, 'bold 26px Arial');
        
        drawField('DISCOUNT', '15% OFF', tx + 550, ty + 120, 'bold 40px Arial');
        
        const expDate = coupon.expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        drawField('EXPIRY DATE', expDate, tx + 550, ty + 210, 'bold 24px Arial');

        // Footer text left
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '12px Arial';
        ctx.fillText('Redeemable at any partner restaurant. Fit Hai Boss!', tx + 40, ty + 310);

        // --- Right Section (Stub) ---
        drawField('HOLDER', coupon.userId.name.toUpperCase().substring(0, 15), splitX + 20, ty + 120, 'bold 18px Arial');
        drawField('DISCOUNT', '15% OFF', splitX + 20, ty + 210, 'bold 24px Arial');
        
        // Draw fake barcode
        ctx.fillStyle = '#333333';
        const bcX = splitX + 20;
        const bcY = ty + 270;
        const bcW = 200;
        const bcH = 40;
        for (let i = 0; i < bcW; i += 4) {
            const barWidth = Math.random() > 0.5 ? 2 : 1;
            if (Math.random() > 0.2) {
                ctx.fillRect(bcX + i, bcY, barWidth, bcH);
            }
        }

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
