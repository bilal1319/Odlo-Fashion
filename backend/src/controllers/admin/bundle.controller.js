import mongoose from "mongoose";
import { Bundle } from "../../models/bundle.model.js"
import { Product } from "../../models/product.model.js"
import { getIO } from "../../socket.js";
import cloudinary from "../../utils/cloudinary.js";

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
      return res.status(400).json({ message: "Missing fields" });
    }

    // 2️⃣ Enforce immutability
    if (await Bundle.findById(_id)) {
      return res.status(409).json({ message: "Bundle ID exists" });
    }

    // 3️⃣ Validate included products
    if (includedProducts?.length) {
      const count = await Product.countDocuments({
        _id: { $in: includedProducts },
      });
      if (count !== includedProducts.length) {
        return res.status(400).json({ message: "Invalid product in bundle" });
      }
    }

    // 4️⃣ Upload images AFTER validation
    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "bundles",
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // 5️⃣ Create bundle
    const bundle = await Bundle.create({
      _id,
      title,
      slug,
      collectionId,
      price,
      currency,
      includedProducts,
      bonuses,
      license,
      images,
    });

    getIO().emit("bundle:changed");

    res.status(201).json(bundle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBundles = async (req, res) => {
  const bundles = await Bundle.find().sort({ createdAt: -1 });
  res.json(bundles);
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
}

export const getBundleById = async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);
  if (!bundle) return res.status(404).json({ message: "Not found" });
  res.json(bundle);
};

export const updateBundle = async (req, res) => {
  try {
    delete req.body._id;
    delete req.body.createdAt;

    const bundle = await Bundle.findById(req.params.id);
    if (!bundle) {
      return res.status(404).json({ message: "Bundle not found" });
    }

    // 1️⃣ Remove selected images (optional)
    // Frontend sends: removeImageIds = ["bundles/abc123"]
    if (req.body.removeImageIds?.length) {
      const idsToRemove = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];

      for (const publicId of idsToRemove) {
        await cloudinary.uploader.destroy(publicId);
      }

      bundle.images = bundle.images.filter(
        (img) => !idsToRemove.includes(img.publicId)
      );
    }

    // 2️⃣ Upload new images (optional)
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "bundles",
        });

        bundle.images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // 3️⃣ Update remaining fields
    Object.assign(bundle, req.body);

    await bundle.save();

    getIO().emit("bundle:changed");

    res.json(bundle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleBundleStatus = async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);
  if (!bundle) return res.status(404).json({ message: "Not found" });

  bundle.isActive = !bundle.isActive;
  await bundle.save();

  getIO().emit("bundle:changed");

  res.json({ isActive: bundle.isActive });
};
