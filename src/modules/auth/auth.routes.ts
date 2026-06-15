import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshTokensHandler,
} from "./auth.controller.js";

const router = Router();

router.post("/register", (req, res) => {
  res.status(403).json({
    status: "error",
    message: "Registration is disabled. Please contact the administrator to create an account."
  });
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user credentials and sign session cookies/tokens
 */
router.post("/login", loginHandler);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Instantly clear session cookies to terminate client session state
 */
router.post("/logout", logoutHandler);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Rotate and issue fresh short-lived access tokens from httpOnly cookies
 */
router.post("/refresh", refreshTokensHandler);

export default router;
