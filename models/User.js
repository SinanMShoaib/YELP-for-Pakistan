const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    fitHaeTokens: { type: Number, default: 0 },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
}, { timestamps: true });

// Automatically hash the password before saving it to the database
userSchema.pre('save', async function() {
    // If password hasn't changed, don't re-hash it
    if (!this.isModified('password')) return;

    try {
        // Hash the password with a salt round of 10
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        throw err; // Mongoose will catch this and pass it to your route
    }
});

module.exports = mongoose.model('User', userSchema);