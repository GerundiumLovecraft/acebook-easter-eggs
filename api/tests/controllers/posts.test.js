const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret,
  );
}

let token;
let userId;

describe("/posts", () => {
  beforeEach(async () => {
    const user = new User({
      email: "post-test@test.com",
      password: "12345678",
      profile: {
        firstName: "User",
        lastName: "Baker",
      }
    });
    await user.save();
    await Post.deleteMany({});
    token = createToken(user.id);
    userId = user.id;
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a post with an image", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          message: "Hello World!",
          image: "https://example.com/image.jpg",
        });

      const posts = await Post.find();
      expect(posts[0].image).toEqual("https://example.com/image.jpg");
    });

    test("saves the user to the post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });

      const posts = await Post.find();
      expect(posts[0].user).toBeDefined();
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
    });

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ message: "I love all my children equally" });
      const post2 = new Post({ message: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns the user with each post", async () => {
      const userToken = createToken(userId);

      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ message: "Hello World!" });

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${userToken}`);

      const posts = response.body.posts;
      expect(posts[0].user).toBeDefined();
      expect(posts[0].user.email).toEqual("post-test@test.com");
    });

    test("returns every post in the collection", async () => {
      const post1 = new Post({ message: "howdy!" });
      const post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      expect(posts[0].message).toEqual("hola!");
      expect(posts[1].message).toEqual("howdy!");
    });

    test("returns a new token", async () => {
      const post1 = new Post({ message: "First Post!" });
      const post2 = new Post({ message: "Second Post!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ message: "howdy!" });
      const post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ message: "howdy!" });
      const post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ message: "howdy!" });
      const post2 = new Post({ message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("POST /posts/:id/like, when token is present", () => {
    test("the response code is 200", async () => {
      const post = new Post({ message: "like this post" });
      await post.save();

      const response = await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("likeCount goes up by 1", async () => {
      const post = new Post({ message: "is this like button working?" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likeCount).toEqual(1);
    });

    test("users id is added to likedBy", async () => {
      const post = new Post({ message: "who liked this post?" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likedBy).toContain(userId);
    });

    test("returns a new token", async () => {
      const post = new Post({ message: "I got a new token!" });
      await post.save();

      const response = await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.body.token).not.toEqual(undefined);
    });

    test("unable to like a post more than once", async () => {
      const post = new Post({ message: "You already liked me" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const response = await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(400);
    });
  });

  describe("POST /posts/:id/like, when token is missing", () => {
    test("the response code is 401", async () => {
      const post = new Post({ message: "You are not logged in" });
      await post.save();

      const response = await request(app).post(`/posts/${post._id}/like`);

      expect(response.status).toEqual(401);
    });

    test("likeCount stays at 0 when not logged in", async () => {
      const post = new Post({ message: "You need to log in first" });
      await post.save();

      const response = await request(app).post(`/posts/${post._id}/like`);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likeCount).toEqual(0);
    });
  });

  describe("DELETE /posts/:id/like, when token is present", () => {
    test("the response code is 200", async () => {
      const post = new Post({ message: "Unlike this post" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const response = await request(app)
        .delete(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("likeCount goes down by 1", async () => {
      const post = new Post({ message: "My likes have gone down" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likeCount).toEqual(0);
    });

    test("userId is removed from likedBy", async () => {
      const post = new Post({ message: "Who unliked my post?" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likedBy).not.toContain(userId);
    });

    test("returns a new token", async () => {
      const post = new Post({ message: "I got a new token" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      const response = await request(app)
        .delete(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.body.token).not.toEqual(undefined);
    });

    test("unable to unlike a post that has not been liked", async () => {
      const post = new Post({ message: "You need to like me to unlike me" });
      await post.save();

      const response = await request(app)
        .delete(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(400);
    });
  });

  describe("DELETE /posts/:id/like, when token is missing", () => {
    test("the response code is 401", async () => {
      const post = new Post({ message: "You need to log in to unlike a post" });
      await post.save();

      const response = await request(app).delete(`/posts/${post._id}/like`);

      expect(response.status).toEqual(401);
    });

    test("likeCount stays at 1 when not logged in", async () => {
      const post = new Post({ message: "You need to log in first" });
      await post.save();

      await request(app)
        .post(`/posts/${post._id}/like`)
        .set("Authorization", `Bearer ${token}`);

      await request(app).delete(`/posts/${post._id}/like`);

      const updatedPost = await Post.findById(post._id);
      expect(updatedPost.likeCount).toEqual(1);
    });
  });
  
  describe("DELETE post, when token is present", () => {
    test("the response code 200 when deleting post that user own", async () => {
      const post = new Post({
        message: "Post to be deleted",
        user: userId
      });
      await post.save();

      const response = await request(app)
        .delete(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("Post successfully deleted");
    });

    test("the response code 403 when deleting post not own by the user ", async () => {
      const secondUser = new User({
        email: "second-test-user@test.com",
        password: "1234makers",
      });
      await secondUser.save();

      const secondUserId = secondUser._id;

      const post = new Post({
        message: "Post from second user",
        user: secondUserId
      });
      await post.save();

      const response = await request(app)
        .delete(`/posts/${post._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(403);
      expect(response.body.message).toEqual("Not authorised to delete the post");
    
    });

    test("the response code 404 when deleting a non existing post", async () => {
      const nonExistingPostId = "69d63ea17d5c631933764ae7"
      const response = await request(app)
        .delete(`/posts/${nonExistingPostId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual("Post not found");
    })
  });
});
