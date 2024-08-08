import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

connectDB();

app.listen(PORT, console.log(`App is running on port ${PORT}`));
