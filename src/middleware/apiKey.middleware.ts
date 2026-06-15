import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errors.js";

export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  // 1. Check if the API key is present
  if (!apiKey) {
    throw new ApiError("API Key is missing from the headers", 401);
  }

  // 2. Validate the API key against the server's environment variable
  if (apiKey !== process.env.API_KEY) {
    throw new ApiError("Invalid API Key provided", 403);
  }

  // 3. Key is valid, proceed to the next middleware or route handler
  next();
};
