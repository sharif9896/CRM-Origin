require("./config/serialization");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();
const path = require("path");

// --- Security & parsing middleware ---
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        frameSrc: [
          "'self'",
          "https://maps.google.com",
          "https://www.google.com",
        ],
        mediaSrc: ["'self'", "https:", "blob:"],
      },
    },
  }),
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"), {
    maxAge: "7d",
    immutable: true,
  }),
);
app.use("/", (req, res) => {
  res.send(
    `<h1>Welcome to the API</h1><p>Please use <a href="/api/v1">/api/v1</a> for API requests.</p>`,
  );
  res
    .status(200)
    .json({
      message: "Welcome to the API. Please use /api/v1 for API requests.",
    });
});
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Basic rate limiting on the API to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// --- Health check ---
app.get("/api/v1/health", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "API is healthy", timestamp: new Date() });
});

// --- Main API routes ---
app.use("/api/v1", routes);

// Serve the production frontend from the same origin.
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (require("fs").existsSync(path.join(frontendDist, "index.html"))) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) =>
    req.path.startsWith("/api/")
      ? next()
      : res.sendFile(path.join(frontendDist, "index.html")),
  );
}
// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
