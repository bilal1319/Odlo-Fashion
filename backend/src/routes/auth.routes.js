import express from "express";
import { 
  login, 
  logout, 
  checkAuth, 
  adminLogin, 
  startSignup, 
  verifyEmailCode, 
  completeSignup, 
  resendVerificationCode, 
  checkTokenStatus,
  // New password reset functions (to be added)
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  validateResetToken
} from '../controllers/auth.controllers.js'
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User routes

// Public routes
router.post('/signup/start', startSignup);           // Step 1: Enter email
router.post('/signup/verify', verifyEmailCode);      // Step 2: Verify code
router.post('/signup/complete', completeSignup);     // Step 3: Set password
router.post('/signup/resend', resendVerificationCode); // Resend code
router.get('/signup/status/:token', checkTokenStatus); // Check status (page refresh)

// Password Reset Routes (NEW)
router.post('/forgot-password', requestPasswordReset);           // Step 1: Request reset (email)
router.post('/verify-reset-code/:token', verifyResetCode);      // Step 2: Verify reset code
router.post('/reset-password/:token', resetPassword);           // Step 3: Set new password
router.get('/validate-reset-token/:token', validateResetToken); // Validate token (optional)

// Login/Logout routes
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", protect, checkAuth);

// Admin routes
router.post("/admin/login", adminLogin);

export default router;