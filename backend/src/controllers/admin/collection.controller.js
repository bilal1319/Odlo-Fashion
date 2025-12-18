import { Collection } from "../../models/collection.model.js";
import { getIO } from "../../socket.js";

export const createCollection = async (req, res) => {
  const { _id, title, slug, description, order } = req.body;

  if (!_id || !title || !slug) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (await Collection.findById(_id)) {
    return res.status(409).json({ message: "Collection ID already exists" });
  }

  const collection = await Collection.create({
    _id,
    title,
    slug,
    description,
    order,
  });

  getIO().emit("collection:changed");

  res.status(201).json(collection);
};

export const getCollections = async (req, res) => {
  const collections = await Collection.find().sort({ order: 1 });
  res.json(collections);
};

export const getCollectionById = async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) return res.status(404).json({ message: "Not found" });
  res.json(collection);
};

export const updateCollection = async (req, res) => {
  delete req.body._id;

  const updated = await Collection.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  getIO().emit("collection:changed");

  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
};

export const deleteCollectionById = async (req, res) => {
  const deleted = await Collection.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  getIO().emit("collection:deleted");
  res.json({ message: "Deleted successfully" });
}

export const toggleCollectionStatus = async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) return res.status(404).json({ message: "Not found" });

  collection.isActive = !collection.isActive;
  await collection.save();

  getIO().emit("collection:changed");

  res.json({ isActive: collection.isActive });
};


