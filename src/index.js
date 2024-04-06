import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import connectDB from './DB/connectionDB.js';

// Configuration of variables
dotenv.config();

// Connecting to Neon cloud based database
connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// Specifically for cloudinary
app.use(express.json({ limit: "50mb" }))

// If the url are encoded like(%20 or +) extended : also allow nested object
app.use(express.urlencoded({ extended: true }));

// Cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN
}))


app.get("/", (req, res) => {
    res.send("Homepage");
});

app.use("/api/v1/user", userRouter)

// Server listen
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})