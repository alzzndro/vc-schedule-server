import { AuthService } from "./auth.service.js";
import { ApiResponse } from "../../utils/api-response.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, } from "../../utils/jwt.js";
import { ApiError } from "../../utils/errors.js";
// Cookie helper configuration
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days match
};
export const registerHandler = asyncHandler(async (req, res) => {
    // Destructure the role straight out of your client requests payload
    const { email, password, firstName, lastName, role } = req.body;
    const newUser = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        role: role || "student", // Default to standard "student" if no role is explicitly passed
    });
    const payload = { userId: newUser.id, role: newUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(201).json(new ApiResponse({
        message: "User registered successfully",
        data: { user: newUser, accessToken },
    }));
});
export const loginHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Validate incoming credentials against active records
    const user = await AuthService.login(email, password);
    // Issue dynamic JWT credentials
    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(200).json(new ApiResponse({
        message: "Login successful",
        data: { user, accessToken },
    }));
});
export const logoutHandler = asyncHandler(async (req, res) => {
    // Clear the refresh token cookie instantly to terminate the session context
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json(new ApiResponse({
        message: "Logged out successfully",
    }));
});
// ... keep your existing refreshTokensHandler at the bottom!
export const refreshTokensHandler = (req, res) => {
    // Read the cookie securely using the cookie-parser package we installed
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new ApiError("Refresh token missing from request", 401);
    }
    try {
        // Verify the validity and expiration of the refresh token string
        const decoded = verifyRefreshToken(refreshToken);
        // Construct a safe, clean payload from the decoded token data
        const newPayload = {
            userId: decoded.userId,
            role: decoded.role,
        };
        // Issue a fresh, short-lived access token to keep their session alive
        const newAccessToken = generateAccessToken(newPayload);
        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    }
    catch (err) {
        // If the token has expired, been altered, or revoked, throw a 403 Forbidden
        throw new ApiError("Refresh token is invalid or expired", 403);
    }
};
//# sourceMappingURL=auth.controller.js.map