import express from "express";
import { getProfileController, loginController, logoutController, registerController } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/registration", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.get("/profile", isAuthenticated, getProfileController);

export default router;