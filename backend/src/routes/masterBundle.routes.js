// routes/master-bundles.routes.js
import express from "express";
import { 
  getMasterBundles,  // Add this import
  masterBundleBySlug 
} from "../controllers/masterBundle.controller.js";

const router = express.Router();

// Get all master bundles (new route)
router.get("/", getMasterBundles);

// Get master bundle by slug
router.get("/:slug", masterBundleBySlug);

export default router;