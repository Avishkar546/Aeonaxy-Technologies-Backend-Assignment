import Jwt from "jsonwebtoken";
import { compare, hashing } from '../utils/passwordHashHandler.js';
import { asyncHandler } from './../utils/asyncHandler.js';
import errorHandler from '../utils/errorHandler.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import courseModel from '../models/courseModel.js';
import userModel from '../models/userModel.js';
import getDataUri from "../utils/dataURI.js";
import cloudinary from 'cloudinary';

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
        success: true,
        message: "Profile details",
        user
    })
})

export const changePasswordController = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    // If empty
    if (!oldPassword || !newPassword) {
        next(new errorHandler("incomplete credentials", 401));
    }

    let user = await userModel.findById(req.user._id);
    const validUser = await compare(oldPassword, user.password);

    if (!validUser) {
        next(new errorHandler("Invalid credentials", 401));
    }

    const hashedPassword = await hashing(newPassword);
    user.password = hashedPassword;

    await user.save();
    res.status(201).json({
        success: true,
        message: "Password changed succesfully",
        user
    })
})

export const updateProfileController = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) return next(new errorHandler("Invalid credentials", 401));

    let user = await userModel.findById(req.user._id);

    user.name = name;
    user.email = email;
    await user.save();

    res.status(201).json({
        success: true,
        message: "Information updated succesfully"
    })

})

export const updateProfileImageController = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);

    const file = req.file;
    if (!file) return next(errorHandler("Provide valid profile", 401));

    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader(fileUri.content);

    user.avatar.public_id = myCloud.public_id;
    user.avatar.url = myCloud.secure_url;

    res.status(201).send({
        success: true,
        message: "Profile image updated succesfully"
    })
})

export const forgotPasswordController = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await userModel.find({ email });
    if (!user) return next(new errorHandler("User does not exist", 401));

    let resetToken = crypto.randomBytes(20).toString();
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordTokenExpire = Date.now() + 15 * 60 * 60 * 1000;

    const url = `${process.env.FRONTEND_URL}/resettoken/${resetToken}`;
    const message = `Click on this link to change password ${url}`;

    sendEmail(message, user.email);

    res.status(200).json({
        success: true,
        message: `reset token is sent to your this ${email}`,
        data
    });
})

export const addToPlaylist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);

    const course = await courseModel.findById(req.body.id);
    if (!course) return next(new errorHandler("Course does not exist", 404));

    user.playlist.push({
        course: course._id,
        poster: course.poster.url
    });

    await user.save();
    res.status(200).json({
        success: true,
        message: `Added to playlsit`,
        user
    });
})

export const removeFromPlaylist = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id);

    const course = await courseModel.findById(req.body.id);
    if (!course) return next(new errorHandler("Course does not exist", 404));

    let newPlaylist = user.playlist.filter((playlist) => {
        if (playlist.course.toString() !== course._id.toString())
            return playlist
    });

    user.playlist = newPlaylist;
    await user.save();
    res.status(200).json({
        success: true,
        message: `Removed from playlsit`,
        user
    });
})