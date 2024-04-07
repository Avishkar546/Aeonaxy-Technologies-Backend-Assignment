import express from "express";
import { createCourseController, getAllCoursesController } from "../controllers/courseController.js";

const router = express.Router();

router.get("/courses", getAllCoursesController);

router.post("/create", createCourseController);

export default router;