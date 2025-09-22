import { Router } from "express";
import authService from "../Services/auth.service.js";
const authController = Router();


//signup
authController.post("/signup", authService.signUp);
//signin

// confirm email

// forgot password

// reset password

// authenticate with Gmail

// resend

export {authController}