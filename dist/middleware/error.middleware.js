import { ApiError } from "../utils/errors.js";
export const errorMiddleware = (err, req, res, next) => {
    const isApiError = err instanceof ApiError;
    const statusCode = isApiError ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        ...(isApiError && err.details ? { details: err.details } : {}),
    });
};
//# sourceMappingURL=error.middleware.js.map