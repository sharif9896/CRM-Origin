const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerifyEmail,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);
router.post("/resend-verify-email", protect, resendVerifyEmail);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
