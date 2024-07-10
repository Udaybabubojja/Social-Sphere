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
        console.log(post)
        if(!post){
            return res.status(404).json({message:"Post not Found!!"});
        }
        if(post.postedBy.toString() !== req.user._id.toString())
            return res.status(401).json({message:"You are not the owner of this post!"});
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({status:"Post deleted!"});

    } catch (error) {
        console.error(error);
        res.status(500).json({message:err.message})
    }
}

const likedPost = async(req, res)=>{
    try {
        const {id} = req.params;
        const userId = req.user._id;
        console.log(userId)
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({message:"post not found"})
        }
        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost){
            await Post.updateOne({_id:id},{$pull: {likes:userId}})
            res.status(200).json({status:"post unliked !!", post: post.likes});
        }else{
            post.likes.push(userId);
            console.log(post.likes)
            await post.save();
            res.status(200).json({status:"post Liked!!!", post:post.likes})
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
        res.status(200).json({status:"Reply is added!", post,reply});
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
        console.log(req)
        res.status(500).json({message:error.message})
    }
}

const getUserPosts = async (req, res) => {
    try
    {
        const {username} = req.params
        if (!username) {
            return res.status(400).json({ message: "User not found!" });
        }
        const user = await User.findOne({username: username});
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const feedPosts = await Post.find({ postedBy: user._id }).sort({createdAt:-1});
        if (!feedPosts || feedPosts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }
        res.status(200).json( feedPosts );
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const exploreFeed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Fetch feed posts excluding the user's own posts
        let feedPosts = await Post.find({ postedBy: { $ne: userId } });

        // Shuffle the feedPosts array
        feedPosts = shuffleArray(feedPosts);

        res.status(200).json({ feedPosts });
    } catch (error) {
        console.error("Error fetching feed posts:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteComment = async (req, res) => {
    try {
      const { postId, replyId } = req.params;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found!" });
      }
  
      const reply = post.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: "Comment not found!" });
      }
  
      if (post.postedBy.toString() !== req.user._id.toString() && reply.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "You are not authorized to delete this comment!" });
      }
  
      post.replies.pull(replyId);
      await post.save();
      res.status(200).json({ status: "Comment deleted!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

// Function to shuffle an array using Fisher-Yates (Knuth) Shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export {createPost, getPost, deletePost, likedPost, replyPost, getFeed, getUserPosts, exploreFeed}