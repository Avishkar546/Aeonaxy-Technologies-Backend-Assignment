import express from "express";
import {
    addLectures,
    createCourseController,
    deleteCourse,
    deleteLectures,
    filterProducts,
    getAllCoursesController,
    getCourseLectures
} from "../controllers/courseController.js";
import singleUplaod from "../middlewares/multer.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/courses", getAllCoursesController);

router.post("/create", isAuthenticated, authorizeAdmin, singleUplaod, createCourseController);

router.delete("/delete-course/:id", isAuthenticated, authorizeAdmin, deleteCourse);

router.get("/get-lectures/:id", isAuthenticated, singleUplaod, getCourseLectures);

router.post("/add-lectures", isAuthenticated, authorizeAdmin, singleUplaod, addLectures);

router.delete("/delete-lecture", isAuthenticated, authorizeAdmin, deleteLectures);

router.get("/filter-product/:keywords", filterProducts);

export default router;