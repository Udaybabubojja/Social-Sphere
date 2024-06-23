import express from 'express';
import { createPost, getPost, deletePost, likedPost, replyPost, getFeed, userPosts} from '../controllers/postController.js';
import {protectRoute} from '../middleware/protectRoute.js'
const router = express.Router();

router.get("/feed", protectRoute, getFeed);
router.get("/user/:userid", protectRoute, userPosts);
router.get("/:id", getPost);

router.post("/create", protectRoute ,createPost);
router.post("/like/:id", protectRoute, likedPost);
router.post("/reply/:id", protectRoute, replyPost)

router.delete("/:id", protectRoute, deletePost);

export default router;