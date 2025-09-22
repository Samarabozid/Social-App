import { GenderEnum, ProviderEnum, RoleEnum, OTPTypesEnum } from "../Enums/user.enum.js";
import { Document } from "mongoose";

interface IOTP{
    value:string,
    expiresAt:number,
    type:OTPTypesEnum
}

interface IUser extends Document {
    firstName:string | undefined,
    lastName:string | undefined,
    email:string | undefined,
    password:string | undefined,
    isVerified:boolean | undefined,
    age:number | undefined,
    role:RoleEnum | undefined,
    gender:GenderEnum | undefined,
    DOB?:Date,
    profilePicture?:string,
    coverPicture?:string,
    provider:ProviderEnum | undefined,
    googleId?:string,
    phoneNumber?:string,
    OTPS?:IOTP[]
}


interface IEmail {
    to: string;
    cc?: string;
    subject: string;
    content: string;
    attachments?:[]
}


export  type {IUser, IEmail, IOTP}