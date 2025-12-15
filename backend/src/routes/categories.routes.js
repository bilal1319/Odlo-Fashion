import express from "express";
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /api/categories
 * Optional: ?collectionId=premium_products
 */
router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database not connected"
      });
    }

    const filter = { isActive: true };

    if (req.query.collectionId) {
      filter.collectionId = req.query.collectionId;
    }

    const categories = await db
      .collection("categories")
      .find(filter)
      .sort({ order: 1 })
      .toArray();

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
});

export default router;
