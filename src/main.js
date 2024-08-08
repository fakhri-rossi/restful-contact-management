import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3000;
import { app } from "./app/app.js";
import { logger } from "./utils/logging.js";

app.listen(PORT, logger.info(`App started on port ${PORT}`));
