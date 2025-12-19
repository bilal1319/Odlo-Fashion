import express from "express";
import upload from "../../middlewares/upload.middleware.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  toggleProductStatus,
  getProductBySlug,
  deleteProduct,
} from "../../controllers/admin/product.controller.js";

const router = express.Router();

// CREATE (with images)
router.post(
  "/",
  upload.array("images", 5),
  createProduct
);

// READ
router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// UPDATE (with images)
router.put(
  "/:id",
  upload.array("images", 5),
  updateProduct
);

// DELETE
router.delete("/:id", deleteProduct);
router.patch("/:id/status", toggleProductStatus);

export default router;
