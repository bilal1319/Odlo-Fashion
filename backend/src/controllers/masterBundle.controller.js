// controllers/masterBundle.controller.js
import mongoose from "mongoose";

// Get all master bundles
export const getMasterBundles = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get all active master bundles
    const masterBundles = await db.collection("master_bundles")
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: masterBundles
    });
  } catch (error) {
    console.error("Get master bundles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch master bundles"
    });
  }
};

// Get master bundle by slug (existing function)
export const masterBundleBySlug = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const masterBundle = await db.collection("master_bundles").findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!masterBundle) {
      return res.status(404).json({
        success: false,
        message: "Master bundle not found"
      });
    }

    const bundles = await db
      .collection("bundles")
      .find({
        _id: { $in: masterBundle.includedBundles },
        isActive: true
      })
      .toArray();

    // Resolve products for each bundle
    const bundlesWithProducts = await Promise.all(
      bundles.map(async (bundle) => {
        const products = await db
          .collection("products")
          .find({
            _id: { $in: bundle.includedProducts },
            isActive: true
          })
          .toArray();

        return {
          ...bundle,
          products
        };
      })
    );

    res.json({
      success: true,
      data: {
        ...masterBundle,
        bundles: bundlesWithProducts
      }
    });
  } catch (error) {
    console.error("Master bundle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch master bundle"
    });
  }
};