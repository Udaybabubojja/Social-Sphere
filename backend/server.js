import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js'; // Ensure the file extension is included
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB connection
connectDB().then(() => {
    console.log("MongoDB is connected to the database");
});
//connection setup done!!

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());

//Routes.....

app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.listen(PORT, ()=>{
    console.log("Server running of port of "+PORT)
})