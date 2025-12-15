import express from "express";
import { getBundleBySlug, getBundles } from "../controllers/bundles.controller.js";

const router = express.Router();

router.get("/", getBundles);

router.get("/:slug", getBundleBySlug);

export default router;
