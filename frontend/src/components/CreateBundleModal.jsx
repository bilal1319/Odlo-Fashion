// components/CreateBundleModal.jsx
import React, { useState } from 'react';
import { XMarkIcon, PhotoIcon, TagIcon, CurrencyDollarIcon, DocumentTextIcon, CubeIcon } from '@heroicons/react/24/outline';

const CreateBundleModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'full_branding',
    price: '',
    originalPrice: '',
    description: '',
    useCase: '',
    items: '',
    features: '',
    status: 'draft'
  });

  const bundleTypes = [
    { id: 'full_branding', name: 'Full Branding Studio', icon: '🎨', description: 'Complete brand identity packages' },
    { id: 'poster_pack', name: 'Poster Mega Pack', icon: '🖼️', description: 'Collection of premium posters' },
    { id: '3d_assets', name: '3D Assets Collection', icon: '📦', description: '3D models and accessories' },
    { id: 'social_media', name: 'Social Media Bundle', icon: '📱', description: 'Social media templates and kits' },
    { id: 'mockups', name: 'Mockup Collection', icon: '💼', description: 'Product mockups and presentations' },
    { id: 'ultimate', name: 'Ultimate Master Bundle', icon: '👑', description: 'All-in-one complete package' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDiscount = () => {
    if (formData.price && formData.originalPrice) {
      const price = parseFloat(formData.price);
      const original = parseFloat(formData.originalPrice);
      if (original > 0 && price < original) {
        const discount = ((original - price) / original) * 100;
        return Math.round(discount);
      }
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
            <CubeIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Bundle
            </h3>
            <p className="text-sm text-gray-600">
              Add a new product bundle to your collection
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
            <TagIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Basic Information
            </h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bundle Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Full Branding Studio Bundle"
              />
            </div>

            {/* Bundle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                {bundleTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name} - {type.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Pricing & Discount
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="1200.00"
                />
              </div>
            </div>

            {/* Sale Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  placeholder="800.00"
                />
              </div>
            </div>

            {/* Discount Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <div className={`w-full px-4 py-2.5 border rounded-lg ${
                discount > 0 
                  ? 'border-green-300 bg-green-50 text-green-700' 
                  : 'border-gray-300 bg-gray-50 text-gray-500'
              }`}>
                {discount > 0 ? (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{discount}% OFF</span>
                    <span className="text-sm">
                      Save ${formData.originalPrice && formData.price ? 
                        (parseFloat(formData.originalPrice) - parseFloat(formData.price)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                ) : (
                  <span>No discount applied</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Bundle Details
            </h4>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="The complete luxury identity system - everything you need to build elite visual identities with breathtaking polish."
            />
          </div>

          {/* Use Case */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience / Use Case
            </label>
            <input
              type="text"
              name="useCase"
              value={formData.useCase}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="designers with high-end clients, boutique owners, fashion startups, creative directors"
            />
          </div>

          {/* Included Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Included Items (comma separated)
            </label>
            <textarea
              name="items"
              value={formData.items}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="Logo Collection, Color Palette, Typography Guide, Mockups, Social Templates"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter items separated by commas. Count: {formData.items ? formData.items.split(',').length : 0} items
            </p>
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Features (one per line)
            </label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="• Complete brand identity system\n• 50+ premium logos\n• Unlimited commercial use\n• Professional mockups\n• 24/7 support"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PhotoIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Bundle Image
            </h4>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 text-gray-400">
                <PhotoIcon className="h-full w-full" />
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-800">
                    <span>Click to upload</span>
                    <input 
                      type="file" 
                      className="sr-only" 
                      accept="image/*" 
                      onChange={(e) => {
                        // Handle file upload here
                        console.log(e.target.files[0]);
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB. Recommended: 800x600px
                </p>
              </div>
            </div>
          </div>
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
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleChange}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
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
          className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200"
        >
          Create Bundle
        </button>
      </div>
    </form>
  );
};

export default CreateBundleModal;