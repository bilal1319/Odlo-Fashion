import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      default: [],
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    collectionId: {
      type: String,
      required: true,
      index: true,
    },

    categoryId: {
      type: String,
      required: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    type: {
      type: String,
      enum: ["standalone", "bundle"],
      default: "standalone",
    },

    description: {
      type: String,
    },

    formats: {
      type: [String],
      default: [],
    },

    useCases: {
      type: [String],
      default: [],
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

export const Product = mongoose.model("Product", productSchema);
