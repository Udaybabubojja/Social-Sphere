import express from 'express';
import { createPost, getPost, deletePost, likedPost, replyPost, getFeed} from '../controllers/postController.js';
import {protectRoute} from '../middleware/protectRoute.js'
const router = express.Router();

router.get("/:id", getPost);
router.post("/feed", protectRoute, getFeed)

router.post("/create", protectRoute ,createPost)
router.post("/like/:id", protectRoute, likedPost);
router.post("/reply/:id", protectRoute, replyPost)

router.delete("/:id", protectRoute, deletePost);

export default router;