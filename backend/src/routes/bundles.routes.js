import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /api/bundles
 * List all bundles
 */
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const bundles = await db
      .collection("bundles")
      .find({ isActive: true })
      .toArray();

    res.json({
      success: true,
      count: bundles.length,
      data: bundles
    });
  } catch (error) {
    console.error("Bundles fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bundles"
    });
  }
});

/**
 * GET /api/bundles/:slug
 * Returns bundle with resolved products
 */
router.get("/:slug", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const bundle = await db.collection("bundles").findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!bundle) {
      return res.status(404).json({
        success: false,
        message: "Bundle not found"
      });
    }

    const products = await db
      .collection("products")
      .find({
        _id: { $in: bundle.includedProducts },
        isActive: true
      })
      .toArray();

    res.json({
      success: true,
      data: {
        ...bundle,
        products
      }
    });
  } catch (error) {
    console.error("Bundle detail error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bundle"
    });
  }
});

export default router;
