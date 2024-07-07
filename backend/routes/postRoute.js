import express from 'express';
import {
  createPost,
  getPost,
  deletePost,
  likedPost,
  replyPost,
  getFeed,
  getUserPosts,
  exploreFeed
} from '../controllers/postController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.get("/user/:username", getUserPosts);
router.get("/:id", getPost);

router.post("/explore", protectRoute, exploreFeed);
router.post("/create", protectRoute, createPost);
router.put("/like/:id", protectRoute, likedPost);
router.put("/reply/:id", protectRoute, replyPost);

router.post("/:id", getPost);

router.delete("/:id", protectRoute, deletePost);

export default router;
