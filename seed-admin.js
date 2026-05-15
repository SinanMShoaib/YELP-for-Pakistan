const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const adminEmail = "admin@fithae.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin already exists!");
            process.exit(0);
        }

        const admin = new User({
            name: "FitHae Master Admin",
            username: "admin_fithae",
            email: adminEmail,
            password: "Admin@123", // Will be hashed by the model's pre-save hook
            role: "admin",
            bio: "System administrator for the FitHae platform."
        });

        await admin.save();
        console.log("Admin account created successfully!");
        console.log("Email: admin@fithae.com");
        console.log("Password: Admin@123");
        
        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err.message);
        process.exit(1);
    }
};

seedAdmin();
