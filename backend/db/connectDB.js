import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const connectDB = async () => {
    const url ="mongodb://127.0.0.1:27017/SocialSphere";
    try {
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB:", err);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
