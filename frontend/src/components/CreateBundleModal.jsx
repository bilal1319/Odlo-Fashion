// components/CreateBundleModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HashtagIcon,
  LockClosedIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  CubeIcon,
  ChevronDownIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import useAdminBundleStore from '../store/adminBundlesStore';
import useProductsStore from '../store/productsSrtore';

const CreateBundleModal = ({ onClose, onCreate, bundle }) => {
  const isEditing = !!bundle;
  
  const {
    isCreating,
    isCreatingMaster,
    isUpdating,
    isUpdatingMaster,
    createBundle,
    createMasterBundle,
    updateBundle,
    updateMasterBundle
  } = useAdminBundleStore();

  // Use products store to fetch products and bundles
  const { products, getAllProducts, bundles, getBundles } = useProductsStore();

  // Collection options
  const collectionOptions = [
    { id: 'ultimate_packs', name: 'Ultimate Packs' },
    { id: 'master_bundle', name: 'Master Bundle' }
  ];

  // Currency options
  const currencyOptions = ['USD', 'EUR', 'GBP', 'INR'];

  // Initialize form state
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    slug: '',
    collectionId: 'ultimate_packs',
    price: '',
    currency: 'USD',
    includedProducts: [], // For ultimate_packs
    includedBundles: [], // For master_bundle
    bonuses: [],
    isActive: true
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bonusInput, setBonusInput] = useState('');
  
  // State for dropdowns
  const [productSearch, setProductSearch] = useState('');
  const [bundleSearch, setBundleSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showBundleDropdown, setShowBundleDropdown] = useState(false);
  
  // Ref for dropdown containers
  const productDropdownRef = useRef(null);
  const bundleDropdownRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          getAllProducts(),
          getBundles()
        ]);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, [getAllProducts, getBundles]);

  // Initialize form with bundle data if editing
  useEffect(() => {
    if (bundle) {
      setFormData({
        _id: bundle._id || '',
        title: bundle.title || '',
        slug: bundle.slug || '',
        collectionId: bundle.collectionId || 'ultimate_packs',
        price: bundle.price || '',
        currency: bundle.currency || 'USD',
        includedProducts: bundle.includedProducts || [],
        includedBundles: bundle.includedBundles || [],
        bonuses: bundle.bonuses || [],
        isActive: bundle.isActive !== undefined ? bundle.isActive : true
      });

      // Set existing image previews
      if (bundle.images && bundle.images.length > 0) {
        setImagePreviews(
          bundle.images.map(img => ({
            url: img.url,
            publicId: img.publicId,
            isExisting: true
          }))
        );
      }
    }
  }, [bundle]);

  // Filter products for dropdown
  const filteredProducts = products.filter(product => {
    const searchTerm = productSearch.toLowerCase();
    return (
      product.title?.toLowerCase().includes(searchTerm) ||
      product._id?.toLowerCase().includes(searchTerm)
    ) && !formData.includedProducts.includes(product._id);
  });

  // Filter bundles for dropdown
  const filteredBundles = bundles.filter(bundleItem => {
    const searchTerm = bundleSearch.toLowerCase();
    return (
      bundleItem.title?.toLowerCase().includes(searchTerm) ||
      bundleItem._id?.toLowerCase().includes(searchTerm)
    ) && !formData.includedBundles.includes(bundleItem._id);
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
      if (bundleDropdownRef.current && !bundleDropdownRef.current.contains(event.target)) {
        setShowBundleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate ID from title (with underscores)
  const generateId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '_')
      .trim();
  };

  // Generate slug from title (with dashes)
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Handle title change - auto-generate ID and slug
  const handleTitleChange = (e) => {
    const title = e.target.value;

    if (!isEditing && title.trim()) {
      const generatedId = generateId(title);
      const generatedSlug = generateSlug(title);

      setFormData(prev => ({
        ...prev,
        title: title,
        _id: generatedId,
        slug: generatedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        title: title
      }));
    }
  };

  // Handle other input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (isEditing && (name === '_id' || name === 'slug')) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          url: e.target.result,
          file: file,
          isExisting: false
        }]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle add bonus
  const handleAddBonus = () => {
    if (bonusInput.trim()) {
      setFormData(prev => ({
        ...prev,
        bonuses: [...prev.bonuses, bonusInput.trim()]
      }));
      setBonusInput('');
    }
  };

  // Handle remove bonus
  const handleRemoveBonus = (index) => {
    setFormData(prev => ({
      ...prev,
      bonuses: prev.bonuses.filter((_, i) => i !== index)
    }));
  };

  // Handle add product (with tag display)
  const handleAddProduct = (productId, productTitle) => {
    if (!formData.includedProducts.includes(productId)) {
      setFormData(prev => ({
        ...prev,
        includedProducts: [...prev.includedProducts, productId]
      }));
      setProductSearch('');
      setShowProductDropdown(false);
    }
  };

  // Handle remove product tag
  const handleRemoveProduct = (productId) => {
    setFormData(prev => ({
      ...prev,
      includedProducts: prev.includedProducts.filter(id => id !== productId)
    }));
  };

  // Handle add bundle (with tag display)
  const handleAddBundle = (bundleId, bundleTitle) => {
    if (!formData.includedBundles.includes(bundleId)) {
      setFormData(prev => ({
        ...prev,
        includedBundles: [...prev.includedBundles, bundleId]
      }));
      setBundleSearch('');
      setShowBundleDropdown(false);
    }
  };

  // Handle remove bundle tag
  const handleRemoveBundle = (bundleId) => {
    setFormData(prev => ({
      ...prev,
      includedBundles: prev.includedBundles.filter(id => id !== bundleId)
    }));
  };

  // Get product title by ID
  const getProductTitle = (productId) => {
    const product = products.find(p => p._id === productId);
    return product ? product.title : productId;
  };

  // Get product image by ID
  const getProductImage = (productId) => {
    const product = products.find(p => p._id === productId);
    return product?.images?.[0]?.url;
  };

  // Get bundle title by ID
  const getBundleTitle = (bundleId) => {
    const bundle = bundles.find(b => b._id === bundleId);
    return bundle ? bundle.title : bundleId;
  };

  // Get bundle image by ID
  const getBundleImage = (bundleId) => {
    const bundle = bundles.find(b => b._id === bundleId);
    return bundle?.images?.[0]?.url;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData._id.trim()) {
      alert('Bundle ID is required');
      return;
    }

    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.slug.trim()) {
      alert('Slug is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Valid price is required');
      return;
    }

    // Validate based on collection type
    if (formData.collectionId === 'ultimate_packs' && formData.includedProducts.length === 0) {
      alert('Please include at least one product for Ultimate Packs');
      return;
    }

    if (formData.collectionId === 'master_bundle' && formData.includedBundles.length === 0) {
      alert('Please include at least one bundle for Master Bundle');
      return;
    }

    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append all required fields
      formDataToSend.append('_id', formData._id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('collectionId', formData.collectionId);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('isActive', formData.isActive);

      // Append arrays
      if (formData.collectionId === 'ultimate_packs') {
        formData.includedProducts.forEach(productId => {
          formDataToSend.append('includedProducts', productId);
        });
      } else if (formData.collectionId === 'master_bundle') {
        formData.includedBundles.forEach(bundleId => {
          formDataToSend.append('includedBundles', bundleId);
        });
      }

      if (formData.bonuses.length > 0) {
        formData.bonuses.forEach(bonus => {
          formDataToSend.append('bonuses', bonus);
        });
      }

      // Append new images
      imagePreviews
        .filter(img => !img.isExisting)
        .forEach(img => {
          if (img.file) {
            formDataToSend.append('images', img.file);
          }
        });

      // Handle create or update
      if (isEditing) {
        if (bundle.isMasterBundle) {
          await updateMasterBundle(bundle._id, formDataToSend);
        } else {
          await updateBundle(bundle._id, formDataToSend);
        }
      } else {
        if (formData.collectionId === 'master_bundle') {
          await createMasterBundle(formDataToSend);
        } else {
          await createBundle(formDataToSend);
        }
      }

      onClose();
      
    } catch (error) {
      console.error('Failed to save bundle:', error);
      alert(`Failed to save bundle: ${error.message}`);
    }
  };

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
              {isEditing ? 'Edit Bundle' : 'Create New Bundle'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Update bundle details' : 'Add a new bundle to your collection'}
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
                placeholder="e.g., Ultimate Branding Bundle"
              />
              {!isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Bundle ID and slug will be auto-generated from title
                </p>
              )}
            </div>

            {/* Bundle ID */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle ID *
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
                  placeholder="Auto-generated: ultimate_branding_bundle"
                />
                {!isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isEditing
                  ? 'Bundle ID cannot be changed'
                  : 'Auto-generated with underscores (e.g., ultimate_branding_bundle)'}
              </p>
            </div>

            {/* Slug */}
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
                  placeholder="Auto-generated: ultimate-branding-bundle"
                />
                {!isEditing && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <LockClosedIcon className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {isEditing
                  ? 'Slug cannot be changed'
                  : 'Auto-generated with dashes (e.g., ultimate-branding-bundle)'}
              </p>
            </div>

            {/* Collection Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bundle Type *
              </label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleInputChange}
                required
                disabled={isEditing}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
              >
                {collectionOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.collectionId === 'ultimate_packs' 
                  ? 'Contains individual products'
                  : 'Contains other bundles'}
              </p>
            </div>

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
                  placeholder="500.00"
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
                {currencyOptions.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Section based on collection type */}
        {formData.collectionId === 'ultimate_packs' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
              <h4 className="text-sm font-semibold text-gray-900">
                Included Products ({formData.includedProducts.length})
              </h4>
            </div>

            {/* Product Selection with Tags */}
            <div className="relative" ref={productDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Products *
              </label>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-2 border border-gray-300 rounded-lg bg-white">
                {formData.includedProducts.length === 0 ? (
                  <span className="text-gray-400 text-sm">No products selected. Start typing to search...</span>
                ) : (
                  formData.includedProducts.map(productId => {
                    const productTitle = getProductTitle(productId);
                    const productImage = getProductImage(productId);
                    return (
                      <div
                        key={productId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 group hover:bg-blue-100 transition-colors"
                      >
                        {productImage && (
                          <img
                            src={productImage}
                            alt={productTitle}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium truncate max-w-[150px]">
                          {productTitle}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(productId)}
                          className="ml-1 p-0.5 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Search Input with Dropdown */}
              <div className="relative">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search products by name or ID..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>

                {/* Dropdown */}
                {showProductDropdown && filteredProducts.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map(product => (
                      <div
                        key={product._id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                        onClick={() => handleAddProduct(product._id, product.title)}
                      >
                        {product.images?.[0] && (
                          <img
                            src={product.images[0].url}
                            alt={product.title}
                            className="h-10 w-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{product.title}</p>
                          <p className="text-xs text-gray-500 truncate">ID: {product._id}</p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Select products to include in this bundle. Products will appear as tags above.
              </p>
            </div>
          </div>
        )}

        {formData.collectionId === 'master_bundle' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CubeIcon className="h-5 w-5 text-gray-700" />
              <h4 className="text-sm font-semibold text-gray-900">
                Included Bundles ({formData.includedBundles.length})
              </h4>
            </div>

            {/* Bundle Selection with Tags */}
            <div className="relative" ref={bundleDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Bundles *
              </label>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-2 border border-gray-300 rounded-lg bg-white">
                {formData.includedBundles.length === 0 ? (
                  <span className="text-gray-400 text-sm">No bundles selected. Start typing to search...</span>
                ) : (
                  formData.includedBundles.map(bundleId => {
                    const bundleTitle = getBundleTitle(bundleId);
                    const bundleImage = getBundleImage(bundleId);
                    return (
                      <div
                        key={bundleId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200 group hover:bg-purple-100 transition-colors"
                      >
                        {bundleImage && (
                          <img
                            src={bundleImage}
                            alt={bundleTitle}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                        )}
                        <span className="text-sm font-medium truncate max-w-[150px]">
                          {bundleTitle}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBundle(bundleId)}
                          className="ml-1 p-0.5 text-purple-500 hover:text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Search Input with Dropdown */}
              <div className="relative">
                <input
                  type="text"
                  value={bundleSearch}
                  onChange={(e) => {
                    setBundleSearch(e.target.value);
                    setShowBundleDropdown(true);
                  }}
                  onFocus={() => setShowBundleDropdown(true)}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search bundles by name or ID..."
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>

                {/* Dropdown */}
                {showBundleDropdown && filteredBundles.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBundles.map(bundle => (
                      <div
                        key={bundle._id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                        onClick={() => handleAddBundle(bundle._id, bundle.title)}
                      >
                        {bundle.images?.[0] && (
                          <img
                            src={bundle.images[0].url}
                            alt={bundle.title}
                            className="h-10 w-10 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{bundle.title}</p>
                          <p className="text-xs text-gray-500 truncate">ID: {bundle._id}</p>
                          <p className="text-xs text-blue-600">
                            {bundle.includedProducts?.length || 0} products
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Select bundles to include in this master bundle. Bundles will appear as tags above.
              </p>
            </div>
          </div>
        )}

        {/* Bonuses */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DocumentTextIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Bonuses ({formData.bonuses.length})
            </h4>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={bonusInput}
              onChange={(e) => setBonusInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBonus())}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Premium Mockups, Font Pack, Tutorials"
            />
            <button
              type="button"
              onClick={handleAddBonus}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Bonus Tags */}
          {formData.bonuses.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.bonuses.map((bonus, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200 group hover:bg-green-100 transition-colors"
                >
                  <span className="text-sm font-medium">{bonus}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBonus(index)}
                    className="ml-1 p-0.5 text-green-500 hover:text-green-700 rounded-full hover:bg-green-200 transition-colors"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PhotoIcon className="h-5 w-5 text-gray-700" />
            <h4 className="text-sm font-semibold text-gray-900">
              Bundle Images ({imagePreviews.length})
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
                checked={formData.isActive === true}
                onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.isActive === false}
                onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
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
          disabled={isCreating || isCreatingMaster || isUpdating || isUpdatingMaster}
          className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating || isCreatingMaster ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating {formData.collectionId === 'master_bundle' ? 'Master Bundle' : 'Bundle'}...
            </>
          ) : isUpdating || isUpdatingMaster ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating...
            </>
          ) : isEditing ? (
            'Update Bundle'
          ) : (
            `Create ${formData.collectionId === 'master_bundle' ? 'Master Bundle' : 'Bundle'}`
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateBundleModal;