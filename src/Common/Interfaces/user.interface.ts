import { GenderEnum, ProviderEnum, RoleEnum, OTPTypesEnum, FriendshipStatusEnum } from "../Enums/user.enum";
import { Document, Types } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

interface IOTP{
    value:string,
    expiresAt:number,
    type:OTPTypesEnum
}

interface IUser extends Document<Types.ObjectId> {
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

interface IBlackListedToken extends Document<Types.ObjectId> {
    tokenId: string,
    expiresAt: Date
}
 

interface IEmail {
    to: string;
    cc?: string;
    subject: string;
    content: string;
    attachments?:[]
}

interface IRequest extends Request {
   loggedInUser: {user: IUser, token: JwtPayload}
}

interface IFriendship extends Document<Types.ObjectId>{
    requestFromId:Types.ObjectId,
    requestToId:Types.ObjectId,
    status:FriendshipStatusEnum
}


export  type {IUser, IEmail, IOTP, IRequest, IBlackListedToken, IFriendship}