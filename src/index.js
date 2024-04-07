import connectDB from './DB/connectionDB.js';
import dotenv from 'dotenv';
import app from './app.js';

// Configuration of variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Connecting to Neon cloud based database
connectDB();


// Server listen
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})