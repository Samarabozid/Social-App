import { Router } from "express";
import { MulterMiddleware } from "../../../Middlewares/index";
import ProfileService from "../Services/profile.service";
import { authenticationMiddleware } from "../../../Middlewares/authentication.middleware";
const profileController = Router();

// update profile

// delete profile

// get profile data

// upload profile picture
profileController.post("/upload-profile-picture",authenticationMiddleware,MulterMiddleware().single("profilePicture"),ProfileService.uploadProfilePicture)
// upload cover picture

// list all users

export {profileController}
