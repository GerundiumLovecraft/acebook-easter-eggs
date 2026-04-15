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
    console.log(
      "Cleared existing users, posts, comments, and friend requests.",
    );

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
          profilePic:
            "https://ca.slack-edge.com/T03ALA7H4-U09G3R64NCW-8c7d089c792a-512",
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
          profilePic:
            "https://ca.slack-edge.com/T03ALA7H4-U0AA29TKGKC-d7beb1ce9f5d-512",
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
      userDocs.map((user) => [user.email, user]),
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
        message: "Just set up my profile. Hello everyone 👋",
        image: "",
        user: christian._id,
        likedBy: [ieva._id, vedant._id, sarah._id, vladislav._id],
        likeCount: 4,
      },
      {
        message: "Back in nyc 🚕🍎🗽",
        image:
          "https://plus.unsplash.com/premium_photo-1725400807692-49aabcd62994?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: sarah._id,
        likedBy: [ieva._id, vedant._id, moshood._id, christian._id],
        likeCount: 4,
      },
      {
        message: "Out for a walk 🍂",
        image:
          "https://images.unsplash.com/photo-1773675320159-b3fa2f612507?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: vladislav._id,
        likedBy: [ieva._id, vedant._id, sarah._id],
        likeCount: 3,
      },
      {
        message: "Finished building my shed today 👷🏽‍♂️",
        image:
          "https://images.unsplash.com/photo-1742735488184-002c93d34cd1?q=80&w=916&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: vedant._id,
        likedBy: [christian._id, moshood._id],
        likeCount: 2,
      },
      {
        message: "Who wants chocolate? 🍫",
        image:
          "https://images.unsplash.com/photo-1600070330808-291e4f8516bc?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: ieva._id,
        likedBy: [christian._id, moshood._id, sarah._id, wedna._id],
        likeCount: 4,
      },
      {
        message: "Training done for the day. Time to relax.",
        image: "",
        user: wedna._id,
        likedBy: [christian._id, ieva._id, wedna._id],
        likeCount: 3,
      },
      {
        message: "Anyone around for coffee later?",
        image: "",
        user: vladislav._id,
        likedBy: [ieva._id],
        likeCount: 1,
      },
      {
        message: "Just finished reading an amazing book 📖",
        image:
          "https://images.unsplash.com/photo-1556970255-32d2cec67cbc?q=80&w=848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: christian._id,
        likedBy: [sarah._id, wedna._id, vladislav._id],
        likeCount: 2,
      },
      {
        message: "Beautiful sunset today 🌅",
        image:
          "https://images.unsplash.com/photo-1629624353854-f9c3630efb40?q=80&w=916&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: ieva._id,
        likedBy: [christian._id, vladislav._id, moshood._id],
        likeCount: 3,
      },
      {
        message: "Just cooked my best meal yet 🍝",
        image:
          "https://images.unsplash.com/photo-1599314250681-8e05113e0e1b?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        user: moshood._id,
        likedBy: [wedna._id, sarah._id],
        likeCount: 2,
      },
    ]);

    const [
      christianPost,
      sarahPost,
      vladislavPost,
      vedantPost,
      ievaPost,
      wednaPost,
      vladislavPost2,
      christianPost2,
      ievaPost2,
      moshoodPost,
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
        content: "Hey Christian 👋",
      },
      {
        postId: vedantPost._id,
        userId: christian._id,
        content: "That sounds productive!",
      },
      {
        postId: vedantPost._id,
        userId: vladislav._id,
        content: "Built that yourself?! 😉",
      },
      {
        postId: ievaPost._id,
        userId: sarah._id,
        content: "Always yes to chocolate! 🤎",
      },
      {
        postId: ievaPost._id,
        userId: moshood._id,
        content: "Save me a chunk",
      },
      {
        postId: wednaPost._id,
        userId: ieva._id,
        content: "Strong work 🏋",
      },
      {
        postId: moshoodPost._id,
        userId: vedant._id,
        content: "Need the recipe for this!",
      },
      {
        postId: vladislavPost2._id,
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
        postId: sarahPost._id,
        userId: wedna._id,
        content: "Best city in the world!",
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
