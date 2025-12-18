import mongoose from "mongoose";
import { Bundle } from "../../models/bundle.model.js"
import { Product } from "../../models/product.model.js"
import { getIO } from "../../socket.js";

export const createBundle = async (req, res) => {
  const { _id, title, slug, collectionId, price, includedProducts } = req.body;

  if (!_id || !title || !slug || price == null) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (await Bundle.findById(_id)) {
    return res.status(409).json({ message: "Bundle ID exists" });
  }

  if (includedProducts?.length) {
    const count = await Product.countDocuments({
      _id: { $in: includedProducts },
    });
    if (count !== includedProducts.length) {
      return res.status(400).json({ message: "Invalid product in bundle" });
    }
  }

  const bundle = await Bundle.create(req.body);
  getIO().emit("bundle:created");
  res.status(201).json(bundle);
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
  delete req.body._id;

  const updated = await Bundle.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  getIO().emit("bundle:changed");

  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
};

export const toggleBundleStatus = async (req, res) => {
  const bundle = await Bundle.findById(req.params.id);
  if (!bundle) return res.status(404).json({ message: "Not found" });

  bundle.isActive = !bundle.isActive;
  await bundle.save();

  getIO().emit("bundle:changed");

  res.json({ isActive: bundle.isActive });
};
