import express from "express";
import { loginController, registerController } from "../controllers/userController.js";

const router = express.Router();

router.post("/registration", registerController);

router.post("/login", loginController);

export default router;