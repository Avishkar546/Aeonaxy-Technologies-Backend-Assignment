import connectDB from './DB/connectionDB.js';
import dotenv from 'dotenv';
import app from './app.js';
import { v2 as cloudinary } from 'cloudinary';

// Configuration of variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Connecting to Neon cloud based database
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


// Server listen
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})