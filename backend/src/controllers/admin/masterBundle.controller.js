import { MasterBundle } from "../../models/masterBundle.model.js";
import { Bundle } from "../../models/bundle.model.js";
import { getIO } from "../../socket.js";
import cloudinary from "../../utils/cloudinary.js";

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
    } = req.body;

    // 1️⃣ Validate required fields
    if (!_id || !title || !slug || price == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 2️⃣ Enforce immutability
    if (await MasterBundle.findById(_id)) {
      return res.status(409).json({ message: "MasterBundle ID exists" });
    }

    // 3️⃣ Validate included bundles
    if (includedBundles?.length) {
      const count = await Bundle.countDocuments({
        _id: { $in: includedBundles },
      });
      if (count !== includedBundles.length) {
        return res
          .status(400)
          .json({ message: "Invalid bundle in master bundle" });
      }
    }

    // 4️⃣ Upload images AFTER validation
    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "master-bundles",
        });

        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // 5️⃣ Create master bundle
    const masterBundle = await MasterBundle.create({
      _id,
      title,
      slug,
      collectionId,
      price,
      currency,
      includedBundles,
      exclusiveBonuses,
      license,
      images,
    });

    getIO().emit("masterBundle:changed");

    res.status(201).json(masterBundle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMasterBundles = async (req, res) => {
  const list = await MasterBundle.find().sort({ createdAt: -1 });
  res.json(list);
};

export const getMasterBundleById = async (req, res) => {
  const mb = await MasterBundle.findById(req.params.id);
  if (!mb) return res.status(404).json({ message: "Not found" });
  res.json(mb);
};

export const getMasterBundleBySlug = async (req, res) => {
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
}

export const updateMasterBundle = async (req, res) => {
  try {
    delete req.body._id;
    delete req.body.createdAt;

    const masterBundle = await MasterBundle.findById(req.params.id);
    if (!masterBundle) {
      return res.status(404).json({ message: "Master bundle not found" });
    }

    // 1️⃣ Remove selected images (optional)
    // Frontend sends: removeImageIds = ["master-bundles/abc123"]
    if (req.body.removeImageIds?.length) {
      const idsToRemove = Array.isArray(req.body.removeImageIds)
        ? req.body.removeImageIds
        : [req.body.removeImageIds];

      for (const publicId of idsToRemove) {
        await cloudinary.uploader.destroy(publicId);
      }

      masterBundle.images = masterBundle.images.filter(
        (img) => !idsToRemove.includes(img.publicId)
      );
    }

    // 2️⃣ Upload new images (optional)
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "master-bundles",
        });

        masterBundle.images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // 3️⃣ Update remaining fields
    Object.assign(masterBundle, req.body);

    await masterBundle.save();

    getIO().emit("masterBundle:changed");

    res.json(masterBundle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleMasterBundleStatus = async (req, res) => {
  const mb = await MasterBundle.findById(req.params.id);
  if (!mb) return res.status(404).json({ message: "Not found" });

  mb.isActive = !mb.isActive;
  await mb.save();

  getIO().emit("masterBundle:changed");

  res.json({ isActive: mb.isActive });
};
