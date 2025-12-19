import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { Collection } from "../../models/collection.model.js";
import { getIO } from "../../socket.js";
import cloudinary from "../../utils/cloudinary.js";

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




    if (!_id || !title || !slug || !collectionId || !categoryId || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await Product.findById(_id);
    if (exists) {
      return res.status(409).json({ message: "Product ID already exists" });
    }

    if (!(await Category.findById(categoryId))) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    if (!(await Collection.findById(collectionId))) {
      return res.status(400).json({ message: "Invalid collectionId" });
    }

    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // 5️⃣ Create product
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
      images,
    });




    getIO().emit("product:changed");

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  try {
    const forbidden = ["_id", "createdAt"];
    forbidden.forEach((f) => delete req.body[f]);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 1️⃣ Remove selected images (if requested)
    // Frontend sends: removeImageIds = ["cloudinary_public_id_1", ...]
    if (req.body.removeImageIds?.length) {
      const idsToRemove = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];

      for (const publicId of idsToRemove) {
        await cloudinary.uploader.destroy(publicId);
      }

      product.images = product.images.filter(
        (img) => !idsToRemove.includes(img.publicId)
      );
    }

    // 2️⃣ Upload new images (if any)
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        product.images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // 3️⃣ Update remaining fields
    Object.assign(product, req.body);

    await product.save();

    getIO().emit("product:changed");

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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


