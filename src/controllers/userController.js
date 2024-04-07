import UserModel from '../models/userModel.js';
import Jwt from "jsonwebtoken";
import { compare, hashing } from '../utils/passwordHashHandler.js';
import { asyncHandler } from './../utils/asyncHandler.js';
import errorHandler from '../utils/errorHandler.js';
import userModel from '../models/userModel.js';

export const registerController = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    // Checking validation of data
    if (!name || !email || !password) {
        next(new errorHandler("Incomplete user details", 401));
    }

    // Check if user already exists
    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
        next(new errorHandler("User Already exists. Please login", 409));
    }

    // REGISTER USER
    const hashedPassword = await hashing(password);
    const registeredUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        avatar: {
            public_id: "temp_id",
            url: "URL"
        }
    });

    res.send({
        success: true,
        message: "Registered Succesfully",
        registeredUser
    })
})

export const loginController = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // If empty
    if (!email || !password) {
        next(new errorHandler("Invalid credentials", 401));
    }

    const user = await UserModel.findOne({ email }); // Check for user in User database

    //If user dose not exists
    if (!user) {
        next(new errorHandler("User not found. Please register", 401));
    }

    const validUser = await compare(password, user.password); // Function used from authHelper to comapre password.
    // If user is not valid
    if (!validUser) {
        next(new errorHandler("Invalid credentials", 401));
    }

    // console.log('Login succesfully');
    // Create the JSON web token for valid logged in user.
    const payload = {
        user: {
            _id: user._id
        }
    };
    const jwtToken = Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7d' });

    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }
    return res.cookie('token', jwtToken, options).status(201).send({
        success: true,
        message: "Login succesfully",
        user
    });
})

export const logoutController = asyncHandler(async (req, res, next) => {
    res.cookie('token', null).status(200).send({
        success: true,
        message: "Logout succesfully"
    })
})

export const getProfileController = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);

    res.status(200).send({
        success:true,
        message:"Profile details",
        user
    })
})