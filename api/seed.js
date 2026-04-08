// To reseed the database, run 'node seed.js' from the /api folder


require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");

const seedUsers = async () => {
    try {
        // 1. Connect to DB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB for seeding...");

        // 2. Clear existing users (Optional - use with caution!)
        await User.deleteMany({});
        console.log("Cleared existing users.");

        // 3. Prepare data
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        const users = [
        {
            email: "alice@example.com",
            password: hashedPassword,
            profile: { firstName: "Alice", lastName: "Wonderland", profilePic: "https://placedog.net/200/200" }
        },
        {
            email: "bob@example.com",
            password: hashedPassword,
            profile: { firstName: "Bob", lastName: "Builder", profilePic: "https://placedog.net/201/201" }
        },
        {
            email: "charlie@example.com",
            password: hashedPassword,
            profile: { firstName: "Charlie", lastName: "Chocolate", profilePic: "https://placedog.net/202/202" }
        }
        ];

        // 4. Insert into DB
        await User.insertMany(users);
        console.log("✅ Database Seeded Successfully!");
        
        // 5. Close connection
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedUsers();