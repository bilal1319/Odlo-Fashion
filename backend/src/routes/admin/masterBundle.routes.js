import express from "express";
import {
  createMasterBundle,
  getMasterBundles,
  getMasterBundleById,
  updateMasterBundle,
  toggleMasterBundleStatus,
  getMasterBundleBySlug,
} from "../../controllers/admin/masterBundle.controller.js";

const router = express.Router();

router.post("/", createMasterBundle);
router.get("/", getMasterBundles);
router.get("/:id", getMasterBundleById);
router.get("/:slug", getMasterBundleBySlug);
router.put("/:id", updateMasterBundle);
router.patch("/:id/status", toggleMasterBundleStatus);

export default router;
