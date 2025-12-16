import express from "express";
<<<<<<< HEAD
import mongoose from "mongoose";

const router = express.Router();

/**
 * GET /api/products
 * Optional query params:
 * - categoryId
 * - collectionId
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

    const { categoryId, collectionId } = req.query;

    const filter = { isActive: true };

    if (categoryId) filter.categoryId = categoryId;
    if (collectionId) filter.collectionId = collectionId;

    const products = await db
      .collection("products")
      .find(filter)
      .toArray();

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
});

/**
 * GET /api/products/:slug
 */
router.get("/:slug", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database not connected"
      });
    }

    const product = await db.collection("products").findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
});
=======
import { getAllProducts, getProductBySlug } from "../controllers/product.controller.js";

const router = express.Router();


router.get("/", getAllProducts);


router.get("/:slug", getProductBySlug);
>>>>>>> origin/faizan-backend

export default router;
