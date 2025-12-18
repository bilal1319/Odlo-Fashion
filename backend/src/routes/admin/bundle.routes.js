import express from "express";
import {
  createBundle,
  getBundles,
  getBundleById,
  updateBundle,
  toggleBundleStatus,
  getBundleBySlug,
} from "../../controllers/admin/bundle.controller.js";

const router = express.Router();

router.post("/", createBundle);
router.get("/", getBundles);
router.get("/:id", getBundleById);
router.get("/:slug", getBundleBySlug);
router.put("/:id", updateBundle);
router.patch("/:id/status", toggleBundleStatus);

export default router;
