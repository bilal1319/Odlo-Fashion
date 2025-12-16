import express from "express";
import  { register, login, logout, checkAuth }  from '../controllers/auth.controllers.js'
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/check", protect, checkAuth);
export default router;
