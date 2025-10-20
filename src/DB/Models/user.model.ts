import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum, IUser, OTPTypesEnum } from "../../Common/index";
import { decrypt, encrypt, generateHash } from "../../Utils";

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        minLength: [4, "First name must be at least 4 characters long"]
    },
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
            name: "idx_email_unique"
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
        enum: RoleEnum,
        default: RoleEnum.USER
    },
    gender: {
        type: String,
        enum: GenderEnum,
        default: GenderEnum.OTHER
    },
    //DOB: Date,
    profilePicture: String,
    coverPicture: String,
    provider: {
        type: String,
        enum: ProviderEnum,
        default: ProviderEnum.LOCAL
    },
    googleId: String,
    phoneNumber: String,
    OTPS: [{
        value: { type: String, required: true },
        expiresAt: { type: Date, default: Date.now() + 600000 },
        type: { type: String, enum: OTPTypesEnum, required: true }
    }]
})

// Document Middleware

userSchema.pre("save", function () {
    console.log("Before saving user", this);
    console.log(this.isModified("password"));
    console.log(this.modifiedPaths());
    console.log(this.getChanges());

    if (this.isModified("password")) {
        // hash password
        this.password = generateHash(this.password as string);
    }

    if (this.isModified("phoneNumber")) {
        // encrypt phone number
        this.phoneNumber = encrypt(this.phoneNumber as string);
    }
})


userSchema.post("save", function () {
    console.log("User Saved");
})


// Query Middleware

userSchema.pre(["findOne", "findOneAndUpdate"], function () {
    console.log("Before finding user", this.getQuery());
    console.log(this.getUpdate());
    console.log(this.getOptions());
})

userSchema.post(/^find/, function (doc) {
    console.log(Object.keys(this));
    if ((this as unknown as { op: string }).op == 'find') {
        doc.forEach((user: IUser) => {
            if(user.phoneNumber){
                user.phoneNumber = decrypt(user.phoneNumber as string)
            }
        })
    } else {
        doc.phoneNumber = decrypt(doc.phoneNumber as string)
    }
})
const UserModel = mongoose.model<IUser>("User", userSchema);



export { UserModel }
