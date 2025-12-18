// components/CreateServiceModal.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon, PhotoIcon, TagIcon, CurrencyDollarIcon, DocumentTextIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

const CreateServiceModal = ({ onClose, onCreate, service }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'luxury-logo-collections',
    price: '',
    description: '',
    useCase: '',
    features: '',
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop'
  });

  const categories = [
    { id: 'luxury-logo-collections', name: 'Luxury Logo Collections' },
    { id: 'branding-identity-packs', name: 'Branding Identity Packs' },
    { id: 'social-media-kits', name: 'Social Media Kits' },
    { id: 'posters-prints', name: 'Posters & Prints' },
    { id: 'mockups', name: 'Mockups' },
    { id: '3d-fashion-assets', name: '3D Fashion Assets' },
  ];

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        category: service.category || 'luxury-logo-collections',
        price: service.price || '',
        description: service.description || '',
        useCase: service.useCase || '',
        features: service.features || '',
        status: service.status || 'draft',
        image: service.image || 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop'
      });
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Required fields validation
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!formData.price.trim()) {
      alert('Price is required');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Description is required');
      return;
    }
    
    onCreate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              {service ? 'Edit Service' : 'Create New Service'}
            </h3>
            <p className="text-sm text-gray-600">
              {service ? 'Update service details' : 'Add a new service to your collection'}
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
            {/* Service Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Couture Serif Logo Pack"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
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
            <h4 className="text-sm font-semibold text-gray-900">
              Pricing
            </h4>
          </div>

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
                value={formData.price.replace('$', '')}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                placeholder="300.00"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Service Details
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
              placeholder="A curated collection of high-fashion serif logos inspired by Parisian couture houses."
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
              placeholder="fashion brands, perfume labels, boutique identities"
            />
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
              placeholder="• Premium quality logos\n• Vector format\n• Unlimited commercial use\n• Easy to customize"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PhotoIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Service Image
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
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData(prev => ({
                              ...prev,
                              image: reader.result
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
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
          
          {/* Image Preview */}
          {formData.image && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
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
          {service ? 'Update Service' : 'Create Service'}
        </button>
      </div>
    </form>
  );
};

export default CreateServiceModal;