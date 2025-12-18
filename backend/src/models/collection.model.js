
import mongoose from "mongoose";


const collectionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const Collection = mongoose.model(
  "Collection",
  collectionSchema
);
