import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
dotenv.config();
/**
 * Environment check
 */
const isProduction = process.env.NODE_ENV === "production";
/**
 * Trust proxy only in production (for load balancers, nginx, etc.)
 */
if (isProduction) {
    app.set("trust proxy", 1);
}
const PORT = Number(process.env.PORT) || 3000;
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`👉 http://localhost:${PORT}`);
        });
        /**
         * Graceful shutdown handler
         */
        const shutdown = (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(() => {
                console.log("✅ HTTP server closed");
                process.exit(0);
            });
        };
        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map