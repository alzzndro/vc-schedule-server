import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_fallback";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_fallback";
export const generateAccessToken = (payload) => {
    const options = {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    };
    // We cast payload as an object to satisfy overload signatures cleanly
    return jwt.sign({ ...payload }, ACCESS_SECRET, options);
};
export const generateRefreshToken = (payload) => {
    const options = {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    };
    return jwt.sign({ ...payload }, REFRESH_SECRET, options);
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
//# sourceMappingURL=jwt.js.map