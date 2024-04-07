import express from "express";
import {
    addToPlaylist,
    changePasswordController,
    forgotPasswordController,
    getProfileController,
    loginController,
    logoutController,
    registerController,
    removeFromPlaylist,
    updateProfileController,
    updateProfileImageController
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/registration", registerController);

router.post("/login", loginController);

router.post("/logout", logoutController);

router.get("/profile", isAuthenticated, getProfileController);

router.put("/change-password", isAuthenticated, changePasswordController);

router.put("/update-profile", isAuthenticated, updateProfileController);

router.put("/update-profile-picture", isAuthenticated, updateProfileImageController);

router.post("/forgot-password", forgotPasswordController);

router.post("/add-to-playlist", addToPlaylist);

router.delete("remove-from-playlist", removeFromPlaylist);

export default router;