import express from "express";
import cors from "cors";
import helmet from "helmet";
// import v1Routes from "./routes/v1/index.js";
import vRoutes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { rateLimitMiddleware } from "./middleware/rate-limit.middleware.js";
import { requestLoggerMiddleware } from "./middleware/request-logger.middleware.js";
import { apiKeyMiddleware } from "./middleware/apiKey.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

/**
 * GLOBAL SECURITY & LOGGING MIDDLEWARES
 */
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or postman)
      if (!origin) return callback(null, true);
      
      // In development, automatically allow all localhost ports
      if (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      
      const allowedOrigin = process.env.CORS_ORIGIN || "*";
      if (allowedOrigin === "*" || allowedOrigin === origin) {
        return callback(null, true);
      }
      
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(requestLoggerMiddleware);
app.use(rateLimitMiddleware);

/**
 * REQUEST PARSING
 */
app.use(express.json());
app.use(cookieParser()); // Allows express to parse req.cookies

/**
 * ROOT ROUTE
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API RUNNING",
  });
});

/**
 * GLOBAL API KEY PROTECTION
 * Every route registered below this line will require the x-api-key header
 */
// app.use(apiKeyMiddleware);

/**
 * API VERSIONING
 */
app.use("/api", vRoutes);

/**
 * FALLBACK 404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use(errorMiddleware);

export default app;
