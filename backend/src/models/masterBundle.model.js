import mongoose from "mongoose";


const masterBundleSchema = new mongoose.Schema(
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

    collectionId: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    includedBundles: {
      type: [String], // bundle _ids
      default: [],
    },

    exclusiveBonuses: {
      type: [String],
      default: [],
    },

    license: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const MasterBundle = mongoose.model(
  "MasterBundle",
  masterBundleSchema
);
