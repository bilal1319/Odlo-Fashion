import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    collectionId: {
      type: String,
      default: "premium_products",
      index: true,
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

export const Category = mongoose.model("Category", categorySchema);
