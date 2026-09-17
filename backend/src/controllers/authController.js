const crypto = require("crypto");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper: sign JWT, set it as an httpOnly cookie, and send the auth response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7) *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
};

// @route POST /api/v1/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError("An account with this email already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "customer",
  });

  // Generate email verification token (in production this would be emailed)
  const verifyToken = user.getEmailVerifyToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Welcome to React CRM! Please verify your email: ${verifyUrl}`,
    });
  } catch (err) {
    // Don't block registration if email sending isn't configured
    console.warn("sendEmail (verify) skipped/failed:", err.message);
  }

  sendTokenResponse(user, 201, res);
});

// @route POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Please provide an email and password", 400);
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  if (!user.active) {
    throw new ApiError("This account has been deactivated", 403);
  }

  sendTokenResponse(user, 200, res);
});

// @route GET /api/v1/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
});

// @route GET /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @route PUT /api/v1/auth/update-profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "phone", "avatar"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @route PUT /api/v1/auth/update-password
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    throw new ApiError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @route POST /api/v1/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // Always respond the same way, whether or not the user exists (avoid email enumeration)
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password reset request",
      text: `You requested a password reset. Reset your password here: ${resetUrl}\nThis link expires in 10 minutes.`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError("Email could not be sent", 500);
  }

  res.status(200).json({
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  });
});

// @route PUT /api/v1/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new ApiError("Invalid or expired reset token", 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @route GET /api/v1/auth/verify-email/:token
exports.verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerifyToken: hashedToken,
    emailVerifyExpires: { $gt: Date.now() },
  }).select("+emailVerifyToken +emailVerifyExpires");

  if (!user) {
    throw new ApiError("Invalid or expired verification token", 400);
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
});

// @route POST /api/v1/auth/resend-verify-email
exports.resendVerifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.isEmailVerified) {
    return res
      .status(200)
      .json({ success: true, message: "Email already verified" });
  }

  const verifyToken = user.getEmailVerifyToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    text: `Please verify your email: ${verifyUrl}`,
  });

  res.status(200).json({ success: true, message: "Verification email sent" });
});
