import express, { Application } from "express";
import middlewares from "../middlewares";
import dbConection from "./db";
import router from "../routes";
import { errorHandler } from "../middlewares/error.middleware";

const app: Application = express();

// Body parser middleware should be first
app.use(express.json());

// Connect to database
dbConection();

// Include other middlewares
app.use(middlewares);

// API routes
app.use("/", router);

// Error handling middleware must be last
app.use(errorHandler);

export default app;
