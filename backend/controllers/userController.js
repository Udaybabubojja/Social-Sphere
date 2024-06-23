// controllers/userController.js
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from '../utils/helpers/generateTokenAndSetCookie.js';
import {v2 as cloudinary} from "cloudinary"
const signupUser = async (req, res) => {
    try {
        const { username, name, profilePic, followers, following, bio, email, password } = req.body;

        // Check if the user already exists
        let existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists" });
        }

        // Hash the password
        const hashPswd = await bcrypt.hash(password, 10);

        // Create the new user
        let newUser = new User({
            username,
            email,
            password: hashPswd,
            name,
            profilePic,
            followers,
            following,
            bio
        });

        // Save the new user
        await newUser.save();

        console.log(newUser);
        generateTokenAndSetCookie(newUser._id,res);
        return res.status(201).json({ user:newUser, status: "User created successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const pswd = password;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(pswd, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({ status: "Login successful", user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:1});
        return res.status(200).json({ status: "Logout successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const followAndUnfollow = async (req, res)=>{
    try{
        const {id} = req.params;
        const userToModify = await User.findById(id);
        console.log(userToModify)
        const currentUser = await User.findById(req.user._id);
        console.log(currentUser)
        if(id === req.user._id.toString()) return res.status(400).json({message:"You cannot follow/unfollow yourself!.."})
        if(!userToModify || !currentUser) return res.status(400).json({message:"Invalid User"});

        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            //unfollow user and modify the current user and follwers of usertomodify;
            await Promise.all([
                User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }),
                User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            ]);

            const updatedUser = await User.findById(id);
            console.log(updatedUser.followers);
            res.status(200).json({ status: "User unfollowed successfully" });
        }else{
            await Promise.all([
                User.findByIdAndUpdate(req.user._id, { $push: { following: id } }),
                User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            ]);

            const updatedUser = await User.findById(id);
            console.log(updatedUser.followers);
            res.status(200).json({ status: "User followed successfully" });
        }

    } catch(err){
        console.error(err);
        return res.status(500).json({ message: "follow or unfllow is not possible" });
    }
}

const updateUser = async(req, res)=>{
    const { name, email, username, password, bio } = req.body;
    const userId = req.user._id;
    let {profilePic} = req.body;
    try {
        let user = await User.findById(userId); // Add 'await' here
        if (!user) return res.status(400).json({ message: "User not found" });
        console.log(req.params.id, userId.toString())
        if(req.params.id !== userId.toString()) return res.status(400).json({ message: "updation of other's username is not possible" });
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashPswd = await bcrypt.hash(password, salt);
            user.password = hashPswd;
        }
        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }
        user.name = name || user.name;
        if (user.username !== username) {
            let newUser = await User.findOne({ username });
            if (newUser) return res.status(400).json({ message: "Username already exists" });
            user.username = username; // Update username here
        }

        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save(); // Save the user document
        res.status(200).json({ status: "Profile updated!", user });
        console.log("Updated!!");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed!" }); // Change 'res.send' to 'res.status'
    }
}

const getUserProfile = async(req, res)=>{
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select("-password").select("-updatedAt");
        if(!user) return res.status(400).json({ message: "User not found" });
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
    }
}

const getUserDetails = async (req, res)=>{
    try {
        const userId = req.user._id;
        let user = await User.findById(userId); // Add 'await' here
        if (!user) return res.status(400).json({ message: "User not found" });
        res.status(200).json(user)
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: "Failed to load data" });
    }
}

export {signupUser, loginUser, logout, followAndUnfollow, updateUser, getUserProfile, getUserDetails}
