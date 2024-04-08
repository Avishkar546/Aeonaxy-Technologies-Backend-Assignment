import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import errorHandler from "../utils/errorHandler.js";
import Jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new errorHandler("Unauthorized access", 401));
    }

    const decoded = Jwt.verify(token, process.env.JWT_KEY);
    req.user = await userModel.findById(decoded._id);
    console.log(req.user);
    next();
})

export const authorizeAdmin = (req, res, next) => {
    if(req.user.role !== 'admin'){
        return next(errorHandler(`${req.user.role} is not allowed to access this resource`, 403));
    }

    next();
}