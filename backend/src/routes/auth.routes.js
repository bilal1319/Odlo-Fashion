import express from "express";
import  { login, logout, checkAuth, adminLogin, startSignup, verifyEmailCode, completeSignup, resendVerificationCode, checkTokenStatus }  from '../controllers/auth.controllers.js'
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// User routes

// Public routes
router.post('/signup/start', startSignup);           // Step 1: Enter email
router.post('/signup/verify', verifyEmailCode);      // Step 2: Verify code
router.post('/signup/complete', completeSignup);     // Step 3: Set password
router.post('/signup/resend', resendVerificationCode); // Resend code
router.get('/signup/status/:token', checkTokenStatus); // Check status (page refresh)


// router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", protect, checkAuth);

// Admin routes
// router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

export default router;

