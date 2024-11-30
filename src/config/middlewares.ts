import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { Router, Request, Response, NextFunction } from "express";

import { authenticate } from "../middlewares/auth.middleware";

const middleware = Router();

// Logging HTTP requests
middleware.use(morgan("dev"));

// Middleware to handle malformed requests (e.g., /%FF)
middleware.use((req: Request, res: Response, next: NextFunction) => {
  try {
    decodeURIComponent(req.path);
    next();
  } catch {
    res.redirect("/404");
  }
});

// CORS configuration
middleware.use(
  cors({
    origin: "*",
  })
);

// Compression middleware to reduce response size
middleware.use(compression());

// Body parsing middleware for JSON and URL-encoded data
middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: true }));

// //authentication middleware
middleware.use(authenticate);

export default middleware;
