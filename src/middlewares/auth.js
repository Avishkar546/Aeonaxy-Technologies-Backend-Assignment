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

    next()
})