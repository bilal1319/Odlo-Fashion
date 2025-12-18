import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  toggleProductStatus,
  getProductBySlug,
  deleteProduct,
} from "../../controllers/admin/product.controller.js";

const router = express.Router()

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:slug", getProductBySlug);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/status", toggleProductStatus);

export default router;
