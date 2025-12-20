// controllers/admin/bundle.controller.js
import mongoose from "mongoose";
import { Bundle } from "../../models/bundle.model.js"
import { Product } from "../../models/product.model.js"
import { getIO } from "../../socket.js";
import cloudinary from "../../utils/cloudinary.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createBundle = async (req, res) => {
  try {
    const {
      _id,
      title,
      slug,
      collectionId,
      price,
      currency,
      includedProducts,
      bonuses,
      license,
    } = req.body;

    // 1️⃣ Validate required fields first
    if (!_id || !title || !slug || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Enforce immutability
    if (await Bundle.findById(_id)) {
      return res.status(409).json({ message: "Bundle ID already exists" });
    }

    // 3️⃣ Validate included products (only for ultimate_packs)
    if (collectionId === 'ultimate_packs' && includedProducts?.length) {
      const count = await Product.countDocuments({
        _id: { $in: includedProducts },
      });
      if (count !== includedProducts.length) {
        return res.status(400).json({ message: "Invalid product in bundle" });
      }
    }

    // 4️⃣ Upload images to Cloudinary using buffer
    const images = [];

    if (req.files?.length) {
      // Map all files to upload promises
      const uploads = req.files.map((file) => 
        uploadToCloudinary(file.buffer, { folder: "bundles" })
      );

      // Execute all uploads in parallel
      const results = await Promise.all(uploads);

      // Process results
      results.forEach((result) => {
        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      });
    }

    // 5️⃣ Create bundle
    const bundle = await Bundle.create({
      _id,
      title,
      slug,
      collectionId,
      price,
      currency,
      includedProducts: collectionId === 'ultimate_packs' ? includedProducts : [],
      bonuses,
      license,
      images,
    });

    // 6️⃣ Emit real-time update
    getIO().emit("bundle:changed");

    res.status(201).json(bundle);
  } catch (err) {
    console.error("Create bundle error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getBundles = async (req, res) => {
  try {
    const { collectionId, isActive } = req.query;

    const filter = {};
    if (collectionId) filter.collectionId = collectionId;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const bundles = await Bundle.find(filter).sort({ createdAt: -1 });
    res.json(bundles);
  } catch (err) {
    console.error("Get bundles error:", err);
    res.status(500).json({ message: "Failed to fetch bundles" });
  }
};

export const getBundleBySlug = async (req, res) => {
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
};

export const getBundleById = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: "Bundle not found" });
    res.json(bundle);
  } catch (err) {
    console.error("Get bundle by ID error:", err);
    res.status(500).json({ message: "Failed to fetch bundle" });
  }
};

export const updateBundle = async (req, res) => {
  try {
    // Remove forbidden fields
    delete req.body._id;
    delete req.body.createdAt;

    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) {
      return res.status(404).json({ message: "Bundle not found" });
    }

    // 1️⃣ Remove selected images (if requested)
    if (req.body.removeImageIds?.length) {
      const idsToRemove = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];

      // Delete from Cloudinary
      for (const publicId of idsToRemove) {
        await cloudinary.uploader.destroy(publicId);
      }

      // Remove from bundle images array
      bundle.images = bundle.images.filter(
        (img) => !idsToRemove.includes(img.publicId)
      );
    }

    // 2️⃣ Upload new images (if any)
    if (req.files?.length) {
      const uploads = req.files.map((file) => 
        uploadToCloudinary(file.buffer, { folder: "bundles" })
      );

      const results = await Promise.all(uploads);

      results.forEach((result) => {
        bundle.images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      });
    }

    // 3️⃣ Validate included products if collection is ultimate_packs
    if (req.body.collectionId === 'ultimate_packs' || bundle.collectionId === 'ultimate_packs') {
      const includedProducts = req.body.includedProducts || bundle.includedProducts;
      if (includedProducts?.length) {
        const count = await Product.countDocuments({
          _id: { $in: includedProducts },
        });
        if (count !== includedProducts.length) {
          return res.status(400).json({ message: "Invalid product in bundle" });
        }
      }
    }

    // 4️⃣ Update remaining fields
    Object.assign(bundle, req.body);

    await bundle.save();

    // 5️⃣ Emit real-time update
    getIO().emit("bundle:changed");

    res.json(bundle);
  } catch (err) {
    console.error("Update bundle error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleBundleStatus = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) return res.status(404).json({ message: "Bundle not found" });

    bundle.isActive = !bundle.isActive;
    await bundle.save();

    getIO().emit("bundle:changed");

    res.json({ isActive: bundle.isActive });
  } catch (err) {
    console.error("Toggle bundle status error:", err);
    res.status(500).json({ message: "Failed to toggle bundle status" });
  }
};

export const deleteBundle = async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) {
      return res.status(404).json({ message: "Bundle not found" });
    }

    // Delete images from Cloudinary
    if (bundle.images?.length) {
      for (const image of bundle.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    // Delete bundle from database
    await Bundle.findByIdAndDelete(req.params.id);

    getIO().emit("bundle:deleted", { id: req.params.id });

    res.json({ message: "Bundle deleted successfully" });
  } catch (err) {
    console.error("Delete bundle error:", err);
    res.status(500).json({ message: "Failed to delete bundle" });
  }
};