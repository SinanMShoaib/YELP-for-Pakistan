const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth'); // Import auth middleware

// REGISTER a new user
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Strong Password Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character." 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "User with this email or username already exists" });

        const user = new User({ name, email, password, username });
        await user.save();
        
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare the plain text password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create the JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secret123', 
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role, bio: user.bio, profileImage: user.profileImage }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, username, bio, profileImage } = req.body;
        
        // Check if username is already taken by someone else
        if (username) {
            const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } });
            if (existingUsername) return res.status(400).json({ message: "Username already taken" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name, username, bio, profileImage } },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;