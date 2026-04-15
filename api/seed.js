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
            email: "christianpoed@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Christian",
            lastName: "Poed",
            profilePic: "https://avatars.githubusercontent.com/u/109964307?v=4",
            },
        },
        {
            email: "ievamazetyte@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Ieva",
            lastName: "Mazetyte",
            profilePic: "https://avatars.githubusercontent.com/u/175971235?v=4",
            },
        },
        {
            email: "vedantshukla@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Vedant",
            lastName: "Shukla",
            profilePic: "https://avatars.githubusercontent.com/u/121100502?v=4",
            },
        },

        // Additional users
        {
            email: "moshooderinfolami@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Moshood",
            lastName: "Erinfolami",
            profilePic: "https://ca.slack-edge.com/T03ALA7H4-U09G3R64NCW-8c7d089c792a-512",
            },
        },
        {
            email: "sarahmaria@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Sarah",
            lastName: "Maria",
            profilePic: "https://avatars.githubusercontent.com/u/233109841?v=4",
            },
        },
        {
            email: "vladislavkasperovich@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Vladislav",
            lastName: "Kasperovich",
            profilePic: "https://ca.slack-edge.com/T03ALA7H4-U0AA29TKGKC-d7beb1ce9f5d-512",
            },
        },
        {
            email: "wednaguirand@example.com",
            password: hashedPassword,
            profile: {
            firstName: "Wedna",
            lastName: "Guirand",
            profilePic: "https://avatars.githubusercontent.com/u/114885212?v=4",
            },
        },
        ]);

        const userByEmail = Object.fromEntries(
        userDocs.map((user) => [user.email, user])
        );

        const christian = userByEmail["christianpoed@example.com"];
        const ieva = userByEmail["ievamazetyte@example.com"];
        const vedant = userByEmail["vedantshukla@example.com"];
        const moshood = userByEmail["moshooderinfolami@example.com"];
        const sarah = userByEmail["sarahmaria@example.com"];
        const vladislav = userByEmail["vladislavkasperovich@example.com"];
        const wedna = userByEmail["wednaguirand@example.com"];

        // 4. Add friendship relations
        // Symmetric friendships so your app can test "has friends", "mutuals", "no friends", etc.
        await Promise.all([
        User.findByIdAndUpdate(christian._id, {
            $set: {
            "social.friendList": [ieva._id, vedant._id, wedna._id],
            },
        }),
        User.findByIdAndUpdate(ieva._id, {
            $set: {
            "social.friendList": [christian._id, moshood._id, vladislav._id],
            },
        }),
        User.findByIdAndUpdate(vedant._id, {
            $set: {
            "social.friendList": [christian._id, sarah._id],
            },
        }),
        User.findByIdAndUpdate(moshood._id, {
            $set: {
            "social.friendList": [ieva._id],
            },
        }),
        User.findByIdAndUpdate(sarah._id, {
            $set: {
            "social.friendList": [vedant._id, vladislav._id],
            },
        }),
        User.findByIdAndUpdate(vladislav._id, {
            $set: {
            "social.friendList": [ieva._id, sarah._id],
            },
        }),
        User.findByIdAndUpdate(wedna._id, {
            $set: {
            "social.friendList": [christian._id],
            },
        }),
        ]);

        console.log("Seeded users and friend relationships.");

        // 5. Create posts
        const postDocs = await Post.insertMany([
        {
            message: "Just set up my profile. Hello everyone :wave:",
            image: "",
            user: christian._id,
            likedBy: [ieva._id, vedant._id],
            likeCount: 2,
        },
        {
            message: "Finished building my new shed today :hammer:",
            image: "https://i.pinimg.com/1200x/f3/39/44/f339446ba68dab8085282b72caadcbb0.jpg",
            user: vedant._id,
            likedBy: [christian._id, moshood._id],
            likeCount: 2,
        },
        {
            message: "Who wants chocolate? :chocolate_bar:",
            image: "https://i.pinimg.com/736x/81/23/27/8123272b961a9f89b18f98fc3a3cc13c.jpg",
            user: ieva._id,
            likedBy: [christian._id, moshood._id],
            likeCount: 2,
        },
        {
            message: "Training done for the day. Time to relax.",
            image: "https://i.pinimg.com/1200x/4a/5a/04/4a5a048bf0c13d11ba232cf4dea4c00d.jpg",
            user: wedna._id,
            likedBy: [christian._id, ieva._id],
            likeCount: 2,
        },
        {
            message: "Mission completed successfully.",
            image: "https://i.pinimg.com/1200x/8e/04/4e/8e044e10ab43aab230063530512fb2b2.jpg",
            user: moshood._id,
            likedBy: [wedna._id],
            likeCount: 1,
        },
        {
            message: "Testing the feed with a post that has no likes yet.",
            image: "",
            user: wedna._id,
            likedBy: [],
            likeCount: 0,
        },
        {
            message: "Anyone around for coffee later?",
            image: "",
            user: vladislav._id,
            likedBy: [ieva._id],
            likeCount: 1,
        },
        {
            message: "Just finished reading an amazing book :books:",
            image: "https://i.pinimg.com/736x/0a/7e/a5/0a7ea5369974a3809c4eeca2c9dd6c31.jpg",
            user: christian._id,
            likedBy: [sarah._id, wedna._id],
            likeCount: 2,
        },
        {
            message: "Beautiful sunset today :sunrise:",
            image: "https://i.pinimg.com/736x/8e/0d/66/8e0d6675cc58f6c56ce2ca78471d0537.jpg",
            user: ieva._id,
            likedBy: [christian._id, vladislav._id, moshood._id],
            likeCount: 3,
        },
        {
            message: "Just cooked my best meal yet :spaghetti:",
            image: "https://i.pinimg.com/736x/28/07/74/2807748974c735d30c4550c323a6e383.jpg",
            user: moshood._id,
            likedBy: [wedna._id, sarah._id],
            likeCount: 2,
        },
        ]);

        const [
        christianPost,
        vedantPost,
        ievaPost,
        wednaPost,
        moshoodPost,
        sarahPost,
        vladislavPost,
        christianPost2,
        ievaPost2,
        moshoodPost2,
        ] = postDocs;

        console.log("Seeded posts.");

        // 6. Create comments
        await Comment.insertMany([
        {
            postId: christianPost._id,
            userId: ieva._id,
            content: "Welcome! Nice to see you here.",
        },
        {
            postId: christianPost._id,
            userId: vedant._id,
            content: "Hey Christian :wave:",
        },
        {
            postId: vedantPost._id,
            userId: christian._id,
            content: "That sounds productive!",
        },
        {
            postId: vedantPost._id,
            userId: vladislav._id,
            content: "Photos or it didn’t happen :smile:",
        },
        {
            postId: ievaPost._id,
            userId: sarah._id,
            content: "Always yes to chocolate.",
        },
        {
            postId: ievaPost._id,
            userId: moshood._id,
            content: "Count me in.",
        },
        {
            postId: wednaPost._id,
            userId: ieva._id,
            content: "Strong work :muscle:.",
        },
        {
            postId: moshoodPost._id,
            userId: vedant._id,
            content: "Nice one!",
        },
        {
            postId: vladislavPost._id,
            userId: ieva._id,
            content: "I might be free around 3.",
        },
        {
            postId: christianPost2._id,
            userId: sarah._id,
            content: "What book was it?",
        },
        {
            postId: ievaPost2._id,
            userId: christian._id,
            content: "Stunning! Where was this?",
        },
        {
            postId: moshoodPost2._id,
            userId: wedna._id,
            content: "Recipe please! :pray:",
        },
        ]);

        console.log("Seeded comments.");

        // 7. Create friend requests
        await FriendRequest.insertMany([
        {
            from: christian._id,
            to: ieva._id,
            status: "approved",
        },
        {
            from: wedna._id,
            to: vedant._id,
            status: "pending",
        },
        {
            from: sarah._id,
            to: moshood._id,
            status: "pending",
        },
        {
            from: vladislav._id,
            to: christian._id,
            status: "rejected",
        },
        {
            from: moshood._id,
            to: wedna._id,
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