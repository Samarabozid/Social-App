import { NextFunction, Request, Response } from "express";
import { IRequest, IUser } from "../../../Common/index.js";
import { UserRepository } from "../../../DB/Repositories/user.repository.js";
import { UserModel } from "../../../DB/Models/user.model.js";
import { compareHash, encrypt, generateHash, localEmitter } from "../../../Utils/index.js";
import { OTPTypesEnum } from "../../../Common/Enums/user.enum.js";
import { BlackListedTokenRepository } from "../../../DB/Repositories/black-listed.repository.js";
import { BlackListedTokensModel } from "../../../DB/Models/index.js";
import { generateToken } from "../../../Utils/Services/token.utils.js";
import { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

class AuthService {

    private userRepo: UserRepository = new UserRepository(UserModel);
    private blackListedTokenRepo: BlackListedTokenRepository = new BlackListedTokenRepository(BlackListedTokensModel);

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password, age, gender, DOB, phoneNumber }: Partial<IUser> = req.body;

        const isEmailExist = await this.userRepo.findOneDocument({ email }, "email");

        if (isEmailExist) {
            return res.status(409).json({ message: "Email already exist", data: { invalidEmail: email } });
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
            type: OTPTypesEnum.ConfirmEmail
        }


        const newUser = await this.userRepo.createNewDocument({
            firstName, lastName, email, password: hashedPassword, age, gender, DOB, phoneNumber: encryptedPhoneNumber, OTPS: [confirmOTP]
        })

        return res.status(201).json({ message: "User created successfully", data: { newUser } });
    }

    confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, OTPS }: Partial<IUser> = req.body;

            // validate input
            if (!email || !OTPS?.[0]?.value) {
                return res.status(400).json({ message: "Email and OTP are required" });
            }

            // fetch user with OTPS field
            const user = await this.userRepo.findOneDocument({ email }, "email OTPS");
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    data: { invalidEmail: email }
                });
            }

            if (!user.OTPS?.[0]?.value) {
                return res.status(400).json({ message: "No OTP stored for this user" });
            }

            // compare OTPs
            const isOTPMatched = compareHash(
                OTPS[0].value,
                user.OTPS[0].value
            );

            if (!isOTPMatched) {
                return res.status(401).json({
                    message: "Invalid OTP",
                    data: { invalidOTP: OTPS }
                });
            }

            // clear OTP after successful verification
            user.OTPS = [];
            await user.save();

            return res.status(200).json({
                message: "Email confirmed successfully",
                data: { user }
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    signIn = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // make sure you also get password here
        const user: IUser  | null = await this.userRepo.findOneDocument({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", data: { invalidEmail: email } });
        }

        const isPasswordMatched = compareHash(password, user.password as string);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: "Invalid email or password", data: { invalidPassword: password } });
        }

        const token = generateToken(
            { _id: user._id,
            email:user.email,
            provider:user.provider,
            role:user.role
            },
            process.env.JWT_ACCESS_SECRET as string,{
                expiresIn:process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
                jwtid:uuidv4()
            }
        )

        const refreshToken = generateToken(
            { _id: user._id,
            email:user.email,
            provider:user.provider,
            role:user.role
            },
            process.env.JWT_REFRESH_SECRET as string,{
                expiresIn:process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
                jwtid:uuidv4()
            }
        )

        return res.status(200).json({
            message: "User logged in successfully",
            data: { accessToken:token, refreshToken },
        });
    };


    logout = async (req: Request, res: Response) => {
        const { token: { jti, exp } } = (req as unknown as IRequest).loggedInUser;
        const blackListedToken = await this.blackListedTokenRepo.createNewDocument({ tokenId: jti, expiresAt: new Date(exp || Date.now() + 600000) });

        return res.status(200).json({ message: "User logged out successfully", data: { blackListedToken } });


    }
}

export default new AuthService();
