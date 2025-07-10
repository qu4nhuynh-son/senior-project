const express = require("express");
const router = express.Router();
const Feed = require("../models/feed");
const User = require("../models/user");

// Tạo bài post mới
router.post("/create-post", async (req, res) => {
    try {
      console.log("Received body:", req.body);
      const { userId, content } = req.body;
  
      const newPost = new Feed({
        user: userId,
        content,
      });
  
      await newPost.save();
      res.status(201).json({ success: true, data: newPost });
    } catch (err) {
      console.error("❌ Failed to create post", err);
      res.status(500).json({ message: "Failed to create post" });
    }
  });
  

// Lấy tất cả bài post
router.get("/get-posts", async (req, res) => {
  try {
    const posts = await Feed.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Like bài post
router.post("/like-post/:id", async (req, res) => {
  try {
    const post = await Feed.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.likes += 1;
    await post.save();

    res.status(200).json({ success: true, message: "Liked", post });
  } catch (error) {
    res.status(500).json({ message: "Error liking post" });
  }
});

// Comment vào bài post
router.post("/comment/:id", async (req, res) => {
  try {
    const { userId, text } = req.body;
    const post = await Feed.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();
    res.status(200).json({ success: true, message: "Comment added", post });
  } catch (error) {
    res.status(500).json({ message: "Error commenting on post" });
  }
});

module.exports = router;
