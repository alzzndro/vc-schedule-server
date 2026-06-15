import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Authentication token missing or malformed", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // Attach user details globally to the request
    next();
  } catch (error) {
    throw new ApiError("Access token has expired or is invalid", 401);
  }
};

/**
 * Role authorization guard.
 * @param allowedRoles - An array of strings representing the roles permitted to access the route.
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Ensure the user is authenticated first
    if (!req.user) {
      throw new ApiError("Authentication required to check permissions", 401);
    }

    // 2. Check if the user's role is included in the allowed roles list
    if (!req.user.role || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        "You do not have permission to perform this action",
        403,
      );
    }

    // 3. Authorized! Move to the next handler
    next();
  };
};
