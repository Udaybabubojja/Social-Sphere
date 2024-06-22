import Post from "../models/postModel.js";
import User from "../models/userModel.js"
import {v2 as cloudinary } from "cloudinary"
const createPost = async (req, res)=>{
    try{
        const {postedBy, text, img} = req.body;
        let profilePic = img;
        if(!postedBy || !text) return res.status(400).json({message:"PostedBy and text fields are required!"})
        const user = await User.findById(postedBy);
        if(!user) return res.status(400).json({message:"User not found"})
        if(user._id.toString() !== req.user._id.toString()) return res.status(400).json({message:"Invalid Authorization!"}) 
        const maxLength=500;
        if(text.length >maxLength) return res.status(400).json({message:"Maximum length increased!!"})
        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }
        const newPost = new Post({postedBy, text, img});
        await newPost.save();
        return res.status(201).json({status:"Post created!!", newPost})
    }catch(err){
        console.error(err);
        res.status(500).json({message:err.message})
    }
}

const getPost = async (req, res)=>{
    try {
        let post = await Post.findById(req.params.id);
        if(!post) return res.status(400).json({message:"Post not found"})
        return res.status(200).json({post});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message})
    }
}

const deletePost = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"Post not Found!!"});
        }
        if(post.postedBy.toString() !== req.user._id.toString())
            return res.status(401).json({message:"You are not the owner of this post!"});
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Post deleted!"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:err.message})
    }
}

const likedPost = async(req, res)=>{
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"post not found"})
        }
        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            await Post.updateOne({_id:postId},{$pull: {likes:userId}})
            res.status(200).json({message:"post unliked !!"});
        }else{
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message:"post Liked!!!"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:err.message})
    }
}

const replyPost = async (req,res)=>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const user = await User.findById(userId)
        const userProfile = user.profilePic;
        const username = user.username;
        console.log(postId, userId, userProfile, username);
        if(!text) return res.status(400).json({message:"Text field is required!!"});
        const post = await Post.findById(postId);
        if(!post) return res.status(400).json({message:"post not found!!"});
        const reply = {userId,text,userProfile, username};
        post.replies.push(reply);
        await post.save();
        res.status(200).json({message:"Reply is added!", post});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:err.message})
    }
}

const getFeed = async(req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message:"Text field is required!!"});
        const following = user.following;
        const feedPosts = await Post.find({postedBy:{$in:following}}).sort({createdAt: -1});
        res.status(200).json({feedPosts});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message})
    }
}

const userPosts = async (req, res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({message:"Text field is required!!"});
        const feedPosts = await Post.find({postedBy:userId});
        res.status(200).json({feedPosts});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:error.message})
    }
}

export {createPost, getPost, deletePost, likedPost, replyPost, getFeed, userPosts}