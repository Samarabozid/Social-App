import { NextFunction, Request, Response } from "express";
import { IUser } from "../../../Common/index.js";
import { UserRepository } from "../../../DB/Repositories/user.repository.js";
import { UserModel } from "../../../DB/Models/user.model.js";
import {encrypt, generateHash, localEmitter} from "../../../Utils/index.js";
import { OTPTypesEnum } from "../../../Common/Enums/user.enum.js";

class AuthService {
    
    private userRepo: UserRepository = new UserRepository(UserModel);
    
    signUp = async (req: Request,res:Response,next:NextFunction) => {
        const {firstName,lastName,email,password,age,gender, DOB,phoneNumber}:Partial<IUser> = req.body ;

        const isEmailExist = await this.userRepo.findOneDocument({email}, "email");

        if(isEmailExist){
            return res.status(409).json({message:"Email already exist", data:{invalidEmail:email}});
        }

        // Encrypt phone number
        const encryptedPhoneNumber = encrypt(phoneNumber as string);

        // Generate hash password
        const hashedPassword = generateHash(password as string);

        // Send OTP
        const otp = Math.floor(100000 + Math.random() * 100000).toString();
        localEmitter.emit("sendEmail", {
            to: email,
            subject: "Verify your email",
            content: `Your OTP is ${otp}`
        })

        const confirmOTP = {
            value: generateHash(otp),
            expiresAt: Date.now() + 600000,
            type:OTPTypesEnum.ConfirmEmail
        }


        const newUser = await this.userRepo.createNewDocument({
            firstName,lastName,email,password:hashedPassword,age,gender,DOB,phoneNumber:encryptedPhoneNumber,OTPS:[confirmOTP]})

        return res.status(201).json({message:"User created successfully", data:{newUser}});
    }
}

export default new AuthService();
