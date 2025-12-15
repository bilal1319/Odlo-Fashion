import express from "express";
import { masterBundleBySlug } from "../controllers/masterBundle.controller.js";

const router = express.Router();


router.get("/:slug", masterBundleBySlug);

export default router;
