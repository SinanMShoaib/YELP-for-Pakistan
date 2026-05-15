const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    couponId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }, // Optional, if specific to a restaurant
    status: { type: String, enum: ['Active', 'Redeemed', 'Expired'], default: 'Active' },
    expiryDate: { type: Date },
    discountValue: { type: String, default: '15% OFF' }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
