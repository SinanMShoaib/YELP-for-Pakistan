require('dotenv').config(); // This line reads your .env file!
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const restaurantRoutes = require('./routes/restaurantRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// restaurant routes 
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reviews', reviewRoutes);

app.use('/api/auth', authRoutes); // <-- New Auth Routes

// The Connection Logic
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Successfully linked to MongoDB!'))
    .catch((err) => console.error('❌ Could not link to MongoDB:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('Server is alive and linked!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});