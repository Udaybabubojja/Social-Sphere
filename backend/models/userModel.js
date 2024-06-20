import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique:true,
            required: true,
            min: 3,
            max: 20,
        },
        name:{
            type:String,
            required:true,
            min:4,
            max:29

        },
        email: {
            type: String,
            required: true,
            unique: true,
            max:48
        },
        password: {
            type: String,
            required: true,
            min:6
        },
        profilePic:{
            type:String,
            default:" "
        },
        followers:{
            type:[String],
            default:[]
        },
        following:{
            type:[String],
            default:[]
        },
        bio:{
            type:String,
            default:""
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;