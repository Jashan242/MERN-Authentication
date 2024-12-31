import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const connect=()=>{
    const dbName = process.env.DB_NAME || "authentication";
    mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`).then(()=>{
        console.log("Database connected successfully");
    })
    .catch((err)=>{
        console.error("Error connecting to database",err);
    })
}