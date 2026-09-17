const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

// Protect routes - requires a valid JWT (from Authorization header or cookie)
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError("Not authorized to access this route. Please log in.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.active) {
      throw new ApiError("The user belonging to this token no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    throw new ApiError("Not authorized to access this route. Invalid token.", 401);
  }
});

// Restrict route to specific roles, e.g. authorize('admin', 'manager')
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    throw new ApiError(
      `User role '${req.user ? req.user.role : "guest"}' is not authorized to access this route`,
      403
    );
  }
  next();
};
