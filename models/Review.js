const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // This links the review to the Restaurant
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String, 
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true }); // Automatically adds 'createdAt'

module.exports = mongoose.model('Review', reviewSchema);