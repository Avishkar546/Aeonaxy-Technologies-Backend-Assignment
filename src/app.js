import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import courseRouter from './routes/courseRoute.js';
import ErrorMiddlerware from './middlewares/Error.js';
import cookieParser from 'cookie-parser';

const app = express();

// Specifically for cloudinary
app.use(express.json())

// If the url are encoded like(%20 or +) extended : also allow nested object
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cross origin resource sharing
app.use(cors({
    origin: process.env.ORIGIN
}))


app.get("/", (req, res) => {
    res.send("Homepage");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

export default app;

app.use(ErrorMiddlerware);