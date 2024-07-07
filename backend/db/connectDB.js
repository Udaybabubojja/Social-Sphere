import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const atlasUrl = process.env.MONGODB_ATLAS_URI; // Ensure you have this environment variable set

const connectDB = async () => {
    try {
        await mongoose.connect(atlasUrl, {
        });
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
