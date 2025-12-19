import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import {
  createMasterBundle,
  getMasterBundles,
  getMasterBundleById,
  updateMasterBundle,
  toggleMasterBundleStatus,
  getMasterBundleBySlug,
} from "../../controllers/admin/masterBundle.controller.js";

const router = express.Router();

// CREATE (with images)
router.post(
  "/",
  upload.array("images", 5),
  createMasterBundle
);

// READ
router.get("/", getMasterBundles);
router.get("/slug/:slug", getMasterBundleBySlug);
router.get("/:id", getMasterBundleById);

// UPDATE (with images)
router.put(
  "/:id",
  upload.array("images", 5),
  updateMasterBundle
);

router.patch("/:id/status", toggleMasterBundleStatus);

export default router;
