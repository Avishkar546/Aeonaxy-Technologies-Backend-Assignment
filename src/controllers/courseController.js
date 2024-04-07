import courseModel from "../models/courseModel.js";
import errorHandler from "../utils/errorHandler.js";
import { asyncHandler } from './../utils/asyncHandler.js';
import getDataUri from './../utils/dataURI';
import cloudinary from 'cloudinary';
import { getAllCoursesController } from './courseController';

// To get courses without lectures
export const getAllCoursesController = asyncHandler(async (req, res, next) => {
    const course = await courseModel.find({}).select("-lectures");

    res.status(200).json({
        success: true,
        message: "All courses fecthed",
        course
    })

})

// Create course only Admin
export const createCourseController = asyncHandler(async (req, res, next) => {
    const { title, description, createdBy, price, category } = req.body;
    if (!title || !description || !createdBy || !price || !category) {
        return next(new errorHandler("Please enter all fields", 400));
    }
    const file = req.file;
    const fileUri = getDataUri(file);

    const myCloud = await cloudinary.v2.uploader(fileUri.content);


    const data = await courseModel.create({
        title, description, price, createdBy, category,
        poster: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    res.status(201).json({
        success: true,
        message: "Course created succesfully",
        data
    })
})

export const getCourseLectures = asyncHandler(async (req, res, next) => {
    const course = await courseModel.find(req.params.id);

    if (!course) next(new errorHandler("Course not found", 404));
    course.views += 1;
    await course.save();
    res.status(200).json({
        success: true,
        message: "All lectures fecthed",
        lecture: course.lecture
    })
})