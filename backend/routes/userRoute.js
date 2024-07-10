import express from 'express';
import { signupUser, loginUser, logout, followAndUnfollow, updateUser, getUserProfile, getUserDetails, getFollowers, getFollowing } from '../controllers/userController.js';
import{ protectRoute} from '../middleware/protectRoute.js';

const router = express.Router();
router.get('/:userid', protectRoute, getUserDetails)
router.get('/:username/followers', protectRoute, getFollowers)
router.get('/:username/following', protectRoute, getFollowing)
router.get('/profile/:username', getUserProfile);

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logout);
router.post('/follow/:id', protectRoute ,followAndUnfollow);
router.put('/update/:id', protectRoute , updateUser);
export default router;
