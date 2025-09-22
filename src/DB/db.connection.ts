import mongoose from "mongoose";

export async function dbConnection () {
    try {
        await mongoose.connect(process.env.DB_URL_LOCAL as string);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(`MongoDB connection error ${error}`);
    }
};

