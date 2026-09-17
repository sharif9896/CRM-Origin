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
const { allowedOrigins, normalizeOrigin } = require("./config/clientOrigins");

const app = express();
const path = require("path");

// Hostinger terminates HTTPS before forwarding requests to Node. Trust the
// first proxy so protocol detection, secure cookies, and rate limiting use the
// visitor's connection details.
app.set("trust proxy", 1);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      return callback(null, true);
    }
    const error = new Error(`Origin ${origin} is not allowed by CORS`);
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
};

// --- Security & parsing middleware ---
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
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
app.use(cors(corsOptions));
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
app.get("/", (req, res) => {
  res.status(200).type("html").send(
    `<h1>Welcome to the API</h1><p>Please use <a href="/api/v1">/api/v1</a> for API requests.</p>`,
  );
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
