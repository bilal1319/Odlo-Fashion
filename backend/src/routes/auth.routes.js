import express from "express";
import  { register, login, logout, checkAuth, adminRegister, adminLogin }  from '../controllers/auth.controllers.js'
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

// User routes
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", protect, checkAuth);

// Admin routes
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);

export default router;

