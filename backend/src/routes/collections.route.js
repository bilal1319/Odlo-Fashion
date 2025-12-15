import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection.db;


    const collections = await db
      .collection("collections")
      .find({  })
      .sort({ order: 1 })
      .toArray();

      
    res.json({
      success: true,
      data: collections
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch collections"
    });
  }
});

export default router;
