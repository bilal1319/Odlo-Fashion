// controllers/admin/masterBundle.controller.js
import mongoose from "mongoose";
import cloudinary from "../../utils/cloudinary.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const getMasterBundles = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const db = mongoose.connection.db;
    
    // Build filter
    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    
    // Get master bundles from MongoDB collection (same as public route but with filter)
    const masterBundles = await db.collection("master_bundles")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(masterBundles);
  } catch (err) {
    console.error("Get master bundles error:", err);
    res.status(500).json({ message: "Failed to fetch master bundles" });
  }
};

export const getMasterBundleById = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    const masterBundle = await db.collection("master_bundles").findOne({
      _id: req.params.id
    });
    
    if (!masterBundle) {
      return res.status(404).json({ message: "Master bundle not found" });
    }
    
    res.json(masterBundle);
  } catch (err) {
    console.error("Get master bundle by ID error:", err);
    res.status(500).json({ message: "Failed to fetch master bundle" });
  }
};

export const getMasterBundleBySlug = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const masterBundle = await db.collection("master_bundles").findOne({
      slug: req.params.slug
    });

    if (!masterBundle) {
      return res.status(404).json({ message: "Master bundle not found" });
    }

    res.json(masterBundle);
  } catch (error) {
    console.error("Get master bundle by slug error:", error);
    res.status(500).json({ message: "Failed to fetch master bundle" });
  }
};

export const createMasterBundle = async (req, res) => {
  try {
    const {
      _id,
      title,
      slug,
      collectionId,
      price,
      currency,
      includedBundles,
      exclusiveBonuses,
      license,
      isActive = true
    } = req.body;

    // 1️⃣ Validate required fields
    if (!_id || !title || !slug || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Check if ID already exists
    const db = mongoose.connection.db;
    const existing = await db.collection("master_bundles").findOne({ _id });
    if (existing) {
      return res.status(409).json({ message: "MasterBundle ID already exists" });
    }

    // 3️⃣ Validate included bundles if provided
    if (includedBundles?.length) {
      const bundlesCount = await db.collection("bundles").countDocuments({
        _id: { $in: includedBundles }
      });
      if (bundlesCount !== includedBundles.length) {
        return res.status(400).json({ message: "Invalid bundle in master bundle" });
      }
    }

    // 4️⃣ Upload images to Cloudinary using buffer
    const images = [];

    if (req.files?.length) {
      // Map all files to upload promises
      const uploads = req.files.map((file) => 
        uploadToCloudinary(file.buffer, { folder: "master-bundles" })
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

    // 5️⃣ Create master bundle document
    const masterBundle = {
      _id,
      title,
      slug,
      collectionId: collectionId || 'master_bundle',
      price: parseFloat(price),
      currency: currency || 'USD',
      includedBundles: includedBundles || [],
      exclusiveBonuses: exclusiveBonuses || [],
      license: license || 'commercial',
      images,
      isActive: isActive === true || isActive === 'true',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    await db.collection("master_bundles").insertOne(masterBundle);

    // 6️⃣ Emit real-time update
    const io = req.app.get('io') || require('../../socket.js').getIO();
    io.emit("masterBundle:changed");

    res.status(201).json(masterBundle);
  } catch (err) {
    console.error("Create master bundle error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateMasterBundle = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Find the master bundle
    const masterBundle = await db.collection("master_bundles").findOne({
      _id: req.params.id
    });
    
    if (!masterBundle) {
      return res.status(404).json({ message: "Master bundle not found" });
    }

    // Remove forbidden fields
    delete req.body._id;
    delete req.body.createdAt;

    // 1️⃣ Remove selected images (if requested)
    if (req.body.removeImageIds?.length) {
      const idsToRemove = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];

      // Delete from Cloudinary
      for (const publicId of idsToRemove) {
        await cloudinary.uploader.destroy(publicId);
      }

      // Remove from master bundle images array
      masterBundle.images = masterBundle.images.filter(
        (img) => !idsToRemove.includes(img.publicId)
      );
    }

    // 2️⃣ Upload new images (if any)
    if (req.files?.length) {
      const uploads = req.files.map((file) => 
        uploadToCloudinary(file.buffer, { folder: "master-bundles" })
      );

      const results = await Promise.all(uploads);

      results.forEach((result) => {
        masterBundle.images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      });
    }

    // 3️⃣ Validate included bundles if provided
    if (req.body.includedBundles?.length) {
      const bundlesCount = await db.collection("bundles").countDocuments({
        _id: { $in: req.body.includedBundles }
      });
      if (bundlesCount !== req.body.includedBundles.length) {
        return res.status(400).json({ message: "Invalid bundle in master bundle" });
      }
    }

    // 4️⃣ Update fields
    Object.assign(masterBundle, req.body);
    masterBundle.updatedAt = new Date();

    // Handle numeric fields
    if (req.body.price !== undefined) {
      masterBundle.price = parseFloat(req.body.price);
    }

    // Handle boolean fields
    if (req.body.isActive !== undefined) {
      masterBundle.isActive = req.body.isActive === true || req.body.isActive === 'true';
    }

    // Update in database
    await db.collection("master_bundles").updateOne(
      { _id: req.params.id },
      { $set: masterBundle }
    );

    // 5️⃣ Emit real-time update
    const io = req.app.get('io') || require('../../socket.js').getIO();
    io.emit("masterBundle:changed");

    res.json(masterBundle);
  } catch (err) {
    console.error("Update master bundle error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleMasterBundleStatus = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    const masterBundle = await db.collection("master_bundles").findOne({
      _id: req.params.id
    });
    
    if (!masterBundle) {
      return res.status(404).json({ message: "Master bundle not found" });
    }

    // Toggle isActive status
    const newStatus = !masterBundle.isActive;
    
    await db.collection("master_bundles").updateOne(
      { _id: req.params.id },
      { 
        $set: { 
          isActive: newStatus,
          updatedAt: new Date()
        } 
      }
    );

    // Emit real-time update
    const io = req.app.get('io') || require('../../socket.js').getIO();
    io.emit("masterBundle:changed");

    res.json({ isActive: newStatus });
  } catch (err) {
    console.error("Toggle master bundle status error:", err);
    res.status(500).json({ message: "Failed to toggle master bundle status" });
  }
};

export const deleteMasterBundle = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    const masterBundle = await db.collection("master_bundles").findOne({
      _id: req.params.id
    });
    
    if (!masterBundle) {
      return res.status(404).json({ message: "Master bundle not found" });
    }

    // Delete images from Cloudinary
    if (masterBundle.images?.length) {
      for (const image of masterBundle.images) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }

    // Delete master bundle from database
    await db.collection("master_bundles").deleteOne({ _id: req.params.id });

    // Emit real-time update
    const io = req.app.get('io') || require('../../socket.js').getIO();
    io.emit("masterBundle:deleted", { id: req.params.id });

    res.json({ message: "Master bundle deleted successfully" });
  } catch (err) {
    console.error("Delete master bundle error:", err);
    res.status(500).json({ message: "Failed to delete master bundle" });
  }
};