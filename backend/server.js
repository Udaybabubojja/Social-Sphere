import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from "cors"
import exp from 'constants';
dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;

// MongoDB connection
connectDB().then(() => {
    console.log("MongoDB is connected to the database");
});
const __dirname = path.resolve()
// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware configuration
app.use(express.json({ limit: '50mb' })); // Increase the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase the limit as needed
app.use(cookieParser());

// Routes
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")))
    app.get("*", (req, res)=>{
        res.sendFile(path.resolve(__dirname, "frontend", "dist","index.html"))
    })
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// on port 4000 it is for backend, frontend
// on port 3000 it is for frontend

// Start the server
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
