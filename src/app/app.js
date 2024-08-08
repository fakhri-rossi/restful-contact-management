import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
dotenv.config();

export const app = express();
connectDB();

app.use(express.json());

app.use(publicRouter);

app.use(errorMiddleware);
