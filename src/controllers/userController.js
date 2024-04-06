import UserModel from '../models/userModel.js';
import Jwt from "jsonwebtoken";
import { compare, hashing } from '../utils/passwordHashHandler.js';

export const registerController = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        // Checking validation of data
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(401).json({
                success: false,
                message: "Incomplete user details",
            })
        }

        // Check if user already exists
        const existedUser = await UserModel.findOne({ email });
        if (existedUser != null) {
            return res.send({
                success: false,
                message: "User Already exists. Please login",
            })
        }

        // REGISTER USER
        const hashedPassword = await hashing(password);
        const registeredUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        res.send({
            success: true,
            message: "Registered Succesfully",
            registeredUser
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in registering",
            error
        })
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // If empty
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Invalid credentials"
            });
        }

        const user = await UserModel.findOne({ email }); // Check for user in User database

        //If user dose not exists
        if (!user) {
            return res.send({
                success: false,
                message: "User not found. Please register"
            });
        }

        const validUser = await compare(password, user.password); // Function used from authHelper to comapre password.
        // If user is not valid
        if (!validUser) {
            return res.send({
                success: false,
                message: "Invalid credentials"
            });
        }

        // console.log('Login succesfully');
        // Create the JSON web token for valid logged in user.
        const payload = {
            user: {
                _id: user._id
            }
        };
        const jwtToken = Jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '7d' });

        // Send the user user web token in response to store it in localStorage.
        return res.send({
            success: true,
            message: "Login succesfully",
            jwtToken, user
        });

    } catch (error) {
        console.log(error);
        return res.status(501).send({
            success: true,
            message: "Internal Server error",
            error
        });
    }
}