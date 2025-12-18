import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { Collection } from "../../models/collection.model.js";
import { getIO } from "../../socket.js";

/**
 * CREATE
 */
export const createProduct = async (req, res) => {
  try {
    const {
      _id,
      title,
      slug,
      collectionId,
      categoryId,
      price,
      currency,
      type,
      description,
      formats,
      useCases,
    } = req.body;

    // Validate required
    if (!_id || !title || !slug || !collectionId || !categoryId || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Enforce immutability
    const exists = await Product.findById(_id);
    if (exists) {
      return res.status(409).json({ message: "Product ID already exists" });
    }

    // Validate relations
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(400).json({ message: "Invalid collectionId" });
    }

    const product = await Product.create({
      _id,
      title,
      slug,
      collectionId,
      categoryId,
      price,
      currency,
      type,
      description,
      formats,
      useCases,
    });

    getIO().emit("product:created");

    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  const { collectionId, categoryId, isActive } = req.query;

  const filter = {};
  if (collectionId) filter.collectionId = collectionId;
  if (categoryId) filter.categoryId = categoryId;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

export const getProductBySlug = async (req, res) => {
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
}

export const updateProduct = async (req, res) => {
  const forbidden = ["_id", "createdAt"];
  forbidden.forEach((f) => delete req.body[f]);

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Product not found" });
  }

  getIO().emit("product:changed");
  // console.log("[SOCKET] product:changed emitted");


  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: "Product not found" });
  }

  getIO().emit("product:deleted");
  res.json({ message: "Product deleted" });
}

export const toggleProductStatus = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }

  getIO().emit("product:changed");

  product.isActive = !product.isActive;
  await product.save();

  res.json({ isActive: product.isActive });
};


