import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./utils/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, console.log(`App is running on port ${PORT}`));
