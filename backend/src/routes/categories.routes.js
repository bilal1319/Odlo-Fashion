import express from "express";
import mongoose from "mongoose";
import { getCategories } from "../controllers/categories.controller.js";

const router = express.Router();


router.get("/", getCategories);

export default router;
