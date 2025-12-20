// routes/admin/bundle.routes.js
import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import {
  createBundle,
  getBundles,
  getBundleById,
  updateBundle,
  toggleBundleStatus,
  getBundleBySlug,
  deleteBundle  // Add this import
} from "../../controllers/admin/bundle.controller.js";

const router = express.Router();

// CREATE (with images)
router.post(
  "/",
  upload.array("images", 5),
  createBundle
);

// READ
router.get("/", getBundles);
router.get("/slug/:slug", getBundleBySlug);
router.get("/:id", getBundleById);

// UPDATE (with images)
router.put(
  "/:id",
  upload.array("images", 5),
  updateBundle
);

router.patch("/:id/status", toggleBundleStatus);

// DELETE
router.delete("/:id", deleteBundle);  // Add this route

export default router;