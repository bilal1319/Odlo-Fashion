import { MasterBundle } from "../../models/masterBundle.model.js";
import { Bundle } from "../../models/bundle.model.js";
import { getIO } from "../../socket.js";

export const createMasterBundle = async (req, res) => {
  const { _id, title, slug, price, includedBundles } = req.body;

  if (!_id || !title || !slug || price == null) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (await MasterBundle.findById(_id)) {
    return res.status(409).json({ message: "MasterBundle ID exists" });
  }

  if (includedBundles?.length) {
    const count = await Bundle.countDocuments({
      _id: { $in: includedBundles },
    });
    if (count !== includedBundles.length) {
      return res.status(400).json({ message: "Invalid bundle in master bundle" });
    }
  }

  const masterBundle = await MasterBundle.create(req.body);
  getIO().emit("masterBundle:created");
  res.status(201).json(masterBundle);
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
  delete req.body._id;

  const updated = await MasterBundle.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  getIO().emit("masterBundle:changed");

  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
};

export const toggleMasterBundleStatus = async (req, res) => {
  const mb = await MasterBundle.findById(req.params.id);
  if (!mb) return res.status(404).json({ message: "Not found" });

  mb.isActive = !mb.isActive;
  await mb.save();

  getIO().emit("masterBundle:changed");

  res.json({ isActive: mb.isActive });
};
