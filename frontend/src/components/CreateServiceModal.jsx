// components/CreateServiceModal.jsx
import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HashtagIcon,
  CheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import useAdminProductsStore from "../store/adminProductsStore";

const CreateServiceModal = ({ onClose, onCreate, product, categories }) => {
  const isEditing = !!product;

  // Common format options
  const formatOptions = [
    "AI",
    "PSD",
    "EPS",
    "PDF",
    "SVG",
    "PNG",
    "JPG",
    "FIG",
    "SKETCH",
    "XD",
    "FONT",
  ];

  // Collection IDs (matching your schema)
  const collectionOptions = [
    { id: "premium_products", name: "Premium Products" },
    { id: "basic_products", name: "Basic Products" },
    { id: "bundles", name: "Bundles" },
  ];

  // Product types (matching your schema)
  const typeOptions = ["standalone", "bundle", "master_bundle"];

  // Currency options
  const currencyOptions = ["USD", "EUR", "GBP", "INR"];

  // Initialize form state
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    slug: "",
    collectionId: "premium_products",
    categoryId: "luxury_logo_collections",
    price: "",
    currency: "USD",
    type: "standalone",
    description: "",
    formats: [],
    useCases: "",
    isActive: true,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { isCreating, isUpdating, isDeleting } = useAdminProductsStore();

  // Initialize form with product data if editing
  useEffect(() => {
    if (product) {
      setFormData({
        _id: product._id || "",
        title: product.title || "",
        slug: product.slug || "",
        collectionId: product.collectionId || "premium_products",
        categoryId: product.categoryId || "luxury_logo_collections",
        price: product.price || "",
        currency: product.currency || "USD",
        type: product.type || "standalone",
        description: product.description || "",
        formats: product.formats || [],
        useCases: product.useCases || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
      });

      // Set existing image previews
      if (product.images && product.images.length > 0) {
        setImagePreviews(
          product.images.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            isExisting: true,
          }))
        );
      }
    }
  }, [product]);

  // Generate ID from title (with underscores)
  const generateId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "") // Remove special characters
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .trim();
  };

  // Generate slug from title (with dashes)
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .trim();
  };

  // Handle title change - auto-generate ID and slug
  const handleTitleChange = (e) => {
    const title = e.target.value;

    if (!isEditing && title.trim()) {
      // Auto-generate both ID and slug for new products
      const generatedId = generateId(title);
      const generatedSlug = generateSlug(title);

      setFormData((prev) => ({
        ...prev,
        title: title,
        _id: generatedId,
        slug: generatedSlug,
      }));
    } else {
      // For editing, only update the title
      setFormData((prev) => ({
        ...prev,
        title: title,
      }));
    }
  };

  // Handle other input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Don't allow changing ID or slug directly in edit mode
    if (isEditing && (name === "_id" || name === "slug")) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle format toggle
  const handleFormatToggle = (format) => {
    setFormData((prev) => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter((f) => f !== format)
        : [...prev.formats, format],
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [
          ...prev,
          {
            url: e.target.result,
            file: file,
            isExisting: false,
          },
        ]);
        setImageFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData._id.trim()) {
      alert("Product ID is required");
      return;
    }

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Slug is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert("Valid price is required");
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      images: imagePreviews
        .filter((img) => !img.isExisting)
        .map((img) => ({
          file: img.file,
          url: img.url,
        })),
      existingImages: imagePreviews
        .filter((img) => img.isExisting)
        .map((img) => ({
          url: img.url,
          publicId: img.publicId,
        })),
    };

    onCreate(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <TagIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Product" : "Create New Product"}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditing
                ? "Update product details"
                : "Add a new product to your collection"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <HashtagIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Basic Information
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Modern Editorial Logo Set"
              />
              {!isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Product ID and slug will be auto-generated from title
                </p>
              )}
            </div>

            {/* Product ID - Auto-generated and not editable */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="_id"
                  value={formData._id}
                  onChange={handleInputChange}
                  required
                  readOnly={!isEditing}
                  disabled={isEditing}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Auto-generated: modern_editorial_logo_set"
                />
                {!isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isEditing
                  ? "Product ID cannot be changed"
                  : "Auto-generated with underscores (e.g., modern_editorial_logo_set)"}
              </p>
            </div>

            {/* Slug - Auto-generated and not editable */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  readOnly={!isEditing}
                  disabled={isEditing}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Auto-generated: modern-editorial-logo-set"
                />
                {!isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isEditing
                  ? "Slug cannot be changed"
                  : "Auto-generated with dashes (e.g., modern-editorial-logo-set)"}
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Collection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection *
              </label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                {collectionOptions.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() +
                      type.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">Pricing</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="300.00"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency *
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                {currencyOptions.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">Content</h4>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="Clean, magazine-ready logotypes with modern geometry..."
            />
          </div>

          {/* Use Cases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Use Cases
            </label>
            <input
              type="text"
              name="useCases"
              value={formData.useCases}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="Magazine layouts, editorial designs, luxury branding..."
            />
          </div>
        </div>

        {/* Formats */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">File Formats</h4>

          <div className="flex flex-wrap gap-2">
            {formatOptions.map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => handleFormatToggle(format)}
                className={`px-3 py-2 rounded-lg border transition flex items-center gap-2 ${
                  formData.formats.includes(format)
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {formData.formats.includes(format) && (
                  <CheckIcon className="h-4 w-4" />
                )}
                {format}
              </button>
            ))}
          </div>

          {formData.formats.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Selected: {formData.formats.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PhotoIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Product Images
            </h4>
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 text-gray-400">
                <PhotoIcon className="h-full w-full" />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Click to upload images</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Previews ({imagePreviews.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={image.url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    {image.isExisting && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                        Existing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="isActive"
                checked={formData.isActive === true}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isActive: true }))
                }
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isActive"
                checked={formData.isActive === false}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isActive: false }))
                }
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Inactive</span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
        >
          Cancel
        </button>
        <button
  type="submit"
  disabled={isCreating || isUpdating}
  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 flex items-center justify-center"
>
  {isCreating ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Creating product...
    </>
  ) : isUpdating ? (
    <>
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Updating product...
    </>
  ) : isEditing ? (
    "Update Product"
  ) : (
    "Create Product"
  )}
</button>
      </div>
    </form>
  );
};

export default CreateServiceModal;
