const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true, lowercase: true, enum: ['islamabad', 'lahore', 'karachi', 'rawalpindi'] },
    location: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    googlePlaceId: { type: String },
    addedBy: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: String
    },
    averageRating: { type: Number, default: null }, 
    reviewCount: { type: Number, default: 0 },
    totalStars: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);