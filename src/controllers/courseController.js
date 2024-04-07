import courseModel from "../models/courseModel.js";
import errorHandler from "../utils/errorHandler.js";
import { asyncHandler } from './../utils/asyncHandler.js';


export const getAllCoursesController = asyncHandler(async (req, res, next) => {
    const course = await courseModel.find({});

    res.status(200).json({
        success: true,
        message: "All courses fecthed",
        course
    })

})

export const createCourseController = asyncHandler(async (req, res, next) => {
    const { title, description, createdBy, price, category } = req.body;

    if (!title || !description || !createdBy || !price || !category) {
        return next(new errorHandler("Please enter all fields", 400));
    }

    const data = await courseModel.create({
        title, description, price, createdBy, category,
        poster: {
            public_id: "demo",
            url: "demo url"
        }
    });

    res.status(201).json({
        success: true,
        message: "Course created succesfully",
        data
    })
})