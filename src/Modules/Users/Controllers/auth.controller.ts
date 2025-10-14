import { Router } from "express";
import AuthService from "../Services/auth.service";
import { authenticationMiddleware } from "../../../Middlewares/index";
import { validationMiddleware } from "../../../Middlewares/validation.middleware";
import { signUpValidator } from "../../../Validators/User/auth.validator";
const authController = Router();


//signup
authController.post("/signup", validationMiddleware(signUpValidator), AuthService.signUp);
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