import express from "express";
import {
    createCourseController,
    getAllCoursesController,
    getCourseLectures
} from "../controllers/courseController.js";
import singleUplaod from "../middlewares/multer.js";

const router = express.Router();

router.get("/courses", getAllCoursesController);

router.post("/create", singleUplaod, createCourseController);

router.get("/get-lectures/:id", singleUplaod, getCourseLectures);

export default router;