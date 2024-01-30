// import { mongoose } from "mongoose";
// import { MONGODB_URI } from "./config";

const mongoose = require("mongoose");
const MONGODB_URI = require("./utils/config").MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.error("MongoDB connection FAIL");
        process.exit(1);
    }
}

module.exports = connectDB;

