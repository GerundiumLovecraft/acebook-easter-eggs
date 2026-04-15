// To reseed the database, run 'node seed.js' from the /api folder

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const FriendRequest = require("./models/friendRequest");

const seedDatabase = async () => {
    try {
        // 1. Connect to DB
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB for seeding...");

        // 2. Clear existing data
        await Promise.all([
        Comment.deleteMany({}),
        FriendRequest.deleteMany({}),
        Post.deleteMany({}),
        User.deleteMany({}),
        ]);
        console.log("Cleared existing users, posts, comments, and friend requests.");

        // 3. Prepare users
        const hashedPassword = await bcrypt.hash("password123", 10);

        const userDocs = await User.insertMany([
        // Keep existing 3 users - same email + password, just enrich their data later
        {
            email: "alice@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Alice",
            lastName: "Wonderland",
            profilePic: "https://placedog.net/200/200",
            },
        },
        {
            email: "bob@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Bob",
            lastName: "Builder",
            profilePic: "https://placedog.net/201/201",
            },
        },
        {
            email: "charlie@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Charlie",
            lastName: "Chocolate",
            profilePic: "https://placedog.net/202/202",
            },
        },

        // Additional users
        {
            email: "diana@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Diana",
            lastName: "Prince",
            profilePic: "https://placedog.net/203/203",
            },
        },
        {
            email: "ethan@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Ethan",
            lastName: "Hunt",
            profilePic: "https://placedog.net/204/204",
            },
        },
        {
            email: "fiona@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Fiona",
            lastName: "Apple",
            profilePic: "https://placedog.net/205/205",
            },
        },
        {
            email: "george@example.com",
            password: hashedPassword,
            profile: {
            firstName: "George",
            lastName: "Jetson",
            profilePic: "https://placedog.net/206/206",
            },
        },
        ]);

        const userByEmail = Object.fromEntries(
        userDocs.map((user) => [user.email, user])
        );

        const alice = userByEmail["alice@example.com"];
        const bob = userByEmail["bob@example.com"];
        const charlie = userByEmail["charlie@example.com"];
        const diana = userByEmail["diana@example.com"];
        const ethan = userByEmail["ethan@example.com"];
        const fiona = userByEmail["fiona@example.com"];
        const george = userByEmail["george@example.com"];

        // 4. Add friendship relations
        // Symmetric friendships so your app can test "has friends", "mutuals", "no friends", etc.
        await Promise.all([
        User.findByIdAndUpdate(alice._id, {
            $set: {
            "social.friendList": [bob._id, charlie._id, diana._id],
            },
        }),
        User.findByIdAndUpdate(bob._id, {
            $set: {
            "social.friendList": [alice._id, diana._id, george._id],
            },
        }),
        User.findByIdAndUpdate(charlie._id, {
            $set: {
            "social.friendList": [alice._id, ethan._id],
            },
        }),
        User.findByIdAndUpdate(diana._id, {
            $set: {
            "social.friendList": [alice._id, bob._id],
            },
        }),
        User.findByIdAndUpdate(ethan._id, {
            $set: {
            "social.friendList": [charlie._id],
            },
        }),
        User.findByIdAndUpdate(fiona._id, {
            $set: {
            "social.friendList": [],
            },
        }),
        User.findByIdAndUpdate(george._id, {
            $set: {
            "social.friendList": [bob._id],
            },
        }),
        ]);

        console.log("Seeded users and friend relationships.");

        // 5. Create posts
        const postDocs = await Post.insertMany([
        {
            message: "Just set up my profile. Hello everyone 👋",
            image: "",
            user: alice._id,
            likedBy: [bob._id, charlie._id, diana._id],
            likeCount: 3,
        },
        {
            message: "Finished building my new shed today 🔨",
            image: "",
            user: bob._id,
            likedBy: [alice._id, george._id],
            likeCount: 2,
        },
        {
            message: "Who wants chocolate? 🍫",
            image: "",
            user: charlie._id,
            likedBy: [alice._id, ethan._id, fiona._id],
            likeCount: 3,
        },
        {
            message: "Training done for the day. Time to relax.",
            image: "",
            user: diana._id,
            likedBy: [alice._id, bob._id],
            likeCount: 2,
        },
        {
            message: "Mission completed successfully.",
            image: "",
            user: ethan._id,
            likedBy: [],
            likeCount: 0,
        },
        {
            message: "Testing the feed with a post that has no likes yet.",
            image: "",
            user: fiona._id,
            likedBy: [],
            likeCount: 0,
        },
        {
            message: "Anyone around for coffee later?",
            image: "",
            user: george._id,
            likedBy: [bob._id],
            likeCount: 1,
        },
        ]);

        const [
        alicePost,
        bobPost,
        charliePost,
        dianaPost,
        ethanPost,
        fionaPost,
        georgePost,
        ] = postDocs;

        console.log("Seeded posts.");

        // 6. Create comments
        await Comment.insertMany([
        {
            postId: alicePost._id,
            userId: bob._id,
            content: "Welcome! Nice to see you here.",
        },
        {
            postId: alicePost._id,
            userId: charlie._id,
            content: "Hey Alice 👋",
        },
        {
            postId: bobPost._id,
            userId: alice._id,
            content: "That sounds productive!",
        },
        {
            postId: bobPost._id,
            userId: george._id,
            content: "Photos or it didn’t happen 😄",
        },
        {
            postId: charliePost._id,
            userId: fiona._id,
            content: "Always yes to chocolate.",
        },
        {
            postId: charliePost._id,
            userId: ethan._id,
            content: "Count me in.",
        },
        {
            postId: dianaPost._id,
            userId: bob._id,
            content: "Strong work.",
        },
        {
            postId: ethanPost._id,
            userId: charlie._id,
            content: "Nice one!",
        },
        {
            postId: georgePost._id,
            userId: bob._id,
            content: "I might be free around 3.",
        },
        ]);

        console.log("Seeded comments.");

        // 7. Create friend requests
        await FriendRequest.insertMany([
        {
            from: alice._id,
            to: bob._id,
            status: "approved",
        },
        {
            from: diana._id,
            to: charlie._id,
            status: "pending",
        },
        {
            from: fiona._id,
            to: bob._id,
            status: "pending",
        },
        {
            from: george._id,
            to: alice._id,
            status: "rejected",
        },
        {
            from: ethan._id,
            to: diana._id,
            status: "pending",
        },
        ]);

        console.log("Seeded friend requests.");

        console.log("✅ Database seeded successfully!");
    } catch (err) {
        console.error("❌ Seeding error:", err);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedDatabase();