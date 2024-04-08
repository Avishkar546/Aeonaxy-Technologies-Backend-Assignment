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

export const deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await courseModel.findById(id);

    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for (let i = 0; i < course.lectures.length; i++) {
        const singleLecture = course.lectures[i];
        await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
            resource_type: "video"
        });
    }

    await course.remove();

    res.status(200).json({
        success: true,
        message: "Course deleted succesfully",
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

export const addLectures = asyncHandler(async (req, res, next) => {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !description || !file) return next(errorHandler("Insufficient data", 400));

    const course = await courseModel.findById(req.course._id);
    if (!course) return next(errorHandler("Course not found", 404));

    const fileUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader(fileUri.content);

    course.lectures.push({
        title,
        description,
        video: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    course.totalNoVideos += 1;

    await course.save();
    res.status(200).json({
        success: true,
        message: "Lectures added succesfully",
        lectures: course.lectures
    })
})

export const deleteLectures = asyncHandler(async (req, res, next) => {
    const { courseId, lectureId } = req.query;

    const course = await courseModel.findById(courseId);
    if (!course) return next(new errorHandler("Course not found", 404));

    const lecture = course.lectures.find((item) => {
        if (item._id.toString() === lectureId.toString()) return item;
    })

    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
        resource_type: "video"
    });

    course.lectures.filter((item) => {
        if (item._id.toString() !== lectureId.toString()) return item;
    })

    course.totalNoVideos -= 1;

    await course.remove();
    res.status(200).json({
        success: true,
        message: "Lecture deleted succesfully",
    })
})