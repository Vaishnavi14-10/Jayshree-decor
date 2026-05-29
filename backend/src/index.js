const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const logger = require("./utils/logger");
const { connectDB } = require("./config/sequelize");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const invoiceRoutes = require("./routes/invoices");
const clientRoutes = require("./routes/clients");

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api/", limiter);

// ─── General Middlewares ──────────────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(
  morgan(NODE_ENV === "production" ? "combined" : "dev", {
    stream: logger.stream,
  }),
);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/invoices", invoiceRoutes);
app.use("/api/clients", clientRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    app: "Jayshree Decor API",
    version: "2.0.0",
    env: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── Serve React Frontend (Production) ────────────────────────────────────────
if (NODE_ENV === "production") {
  const frontendBuild = path.join(__dirname, "../../../frontend/build");
  app.use(express.static(frontendBuild));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    res.sendFile(path.join(frontendBuild, "index.html"));

  });
}

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  process.exit(0);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) =>
  logger.error("Unhandled Rejection:", reason),
);
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

// ─── Start ────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(
      `🚀 Jayshree Decor API running on http://localhost:${PORT} [${NODE_ENV}]`,
    );
  });
});
