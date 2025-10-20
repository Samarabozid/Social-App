import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum, IUser, OTPTypesEnum } from "../../Common/index";
import { encrypt, generateHash } from "../../Utils";

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true,
       minLength: [4, "First name must be at least 4 characters long"]    },
    lastName: {
        type: String,
        required: true,
       minLength: [4, "Last name must be at least 4 characters long"]   
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name:"idx_email_unique"
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        
    },
    role: {
        type: String,
        enum:RoleEnum,
        default: RoleEnum.USER
    },
    gender: {
        type: String,
        enum:GenderEnum,
        default: GenderEnum.OTHER
    },
    //DOB: Date,
    profilePicture: String,
    coverPicture: String,
    provider: {
        type: String,
        enum:ProviderEnum,
        default: ProviderEnum.LOCAL
    },
    googleId: String,
    phoneNumber: String,
    OTPS: [{
        value: {type: String, required: true},
        expiresAt: {type: Date, default: Date.now() + 600000},
        type: {type: String, enum: OTPTypesEnum, required: true}
    }]
})

userSchema.pre("save", function () {
    console.log("Before saving user", this);
    console.log(this.isModified("password"));
    console.log(this.modifiedPaths());
    console.log(this.getChanges());

    if (this.isModified("password")) {
        // hash password
        this.password = generateHash(this.password as string);
    }

    if(this.isModified("phoneNumber")){
        // encrypt phone number
        this.phoneNumber = encrypt(this.phoneNumber as string);
    }
})


userSchema.post("save", function () {
    console.log("User Saved");
})

const UserModel = mongoose.model<IUser>("User", userSchema);



export {UserModel}
