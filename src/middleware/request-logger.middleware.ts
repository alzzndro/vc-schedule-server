import morgan from "morgan";

// Use 'dev' format for concise colored logs, 'combined' for standard Apache style
const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

export const requestLoggerMiddleware = morgan(format);
