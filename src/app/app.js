import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/api.js";
dotenv.config();

export const app = express();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("GET / succeed");
});

app.use(publicRouter);
app.use(userRouter);

app.use(errorMiddleware);
