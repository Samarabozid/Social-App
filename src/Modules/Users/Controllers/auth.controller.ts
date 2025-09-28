import { Router } from "express";
import AuthService from "../Services/auth.service.js";
import { authenticationMiddleware } from "../../../Middlewares/index.js";
const authController = Router();


//signup
authController.post("/signup", AuthService.signUp);
//signin
authController.post("/signin", AuthService.signIn);

// confirm email
authController.put("/confirm-email", AuthService.confirmEmail);

// forgot password

// reset password

// authenticate with Gmail

// resend

// logout
authController.post("/logout", authenticationMiddleware, AuthService.logout);

export {authController}