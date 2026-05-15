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
    totalStars: { type: Number, default: 0 },
    categories: [String],
    priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'] },
    amenities: [String],
    hours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    status: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);