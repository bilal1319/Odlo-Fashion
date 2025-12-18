import express from "express";
import {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  toggleCollectionStatus,
  deleteCollectionById,
} from "../../controllers/admin/collection.controller.js";

const router = express.Router();

router.post("/", createCollection);
router.get("/", getCollections);
router.get("/:id", getCollectionById);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollectionById);
router.patch("/:id/status", toggleCollectionStatus);

export default router;
