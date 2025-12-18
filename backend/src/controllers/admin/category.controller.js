import { Category } from "../../models/category.model.js";
import { Collection } from "../../models/collection.model.js";
import { getIO } from "../../socket.js";

export const createCategory = async (req, res) => {
  const { _id, title, slug, collectionId, description, order } = req.body;

  if (!_id || !title || !slug) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!(await Collection.findById(collectionId))) {
    return res.status(400).json({ message: "Invalid collectionId" });
  }

  if (await Category.findById(_id)) {
    return res.status(409).json({ message: "Category ID exists" });
  }

  const category = await Category.create({
    _id,
    title,
    slug,
    collectionId,
    description,
    order,
  });

  getIO().emit("category:created");

  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const { collectionId } = req.query;
  const filter = collectionId ? { collectionId } : {};
  const categories = await Category.find(filter).sort({ order: 1 });
  res.json(categories);
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });
  res.json(category);
};

export const updateCategory = async (req, res) => {
  delete req.body._id;

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  getIO().emit("category:changed");

  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
};

export const toggleCategoryStatus = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Not found" });

  category.isActive = !category.isActive;
  await category.save();

  getIO().emit("category:changed");

  res.json({ isActive: category.isActive });
};
