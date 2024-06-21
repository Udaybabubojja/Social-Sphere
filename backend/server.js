import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
connectDB().then(() => {
    console.log("MongoDB is connected to the database");
});

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
