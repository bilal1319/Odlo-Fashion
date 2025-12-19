// pages/ServicesManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import CreateServiceModal from '../components/CreateServiceModal';
import useAdminProductsStore from '../store/adminProductsStore';
import useProductsStore from '../store/productsSrtore';
import { getIO } from '../utils/socketClient';

const ServicesManagement = () => {
  // Use admin products store
  const {
    adminProducts,
    isAdminLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getAdminProducts
  } = useAdminProductsStore();

  // Use products store for socket updates
  const { getAllProducts } = useProductsStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch admin products on mount
  useEffect(() => {
    fetchProducts();
    
    // Set up socket listener for real-time updates
    const socket = getIO();
    if (socket) {
      socket.on('product:changed', () => {
        console.log('📦 Received product:changed event - refreshing data');
        fetchProducts();
        getAllProducts();
      });
      
      socket.on('product:deleted', (data) => {
        console.log('🗑️ Received product:deleted event', data);
        fetchProducts();
        getAllProducts();
      });
    }
    
    return () => {
      if (socket) {
        socket.off('product:changed');
        socket.off('product:deleted');
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      await getAdminProducts();
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Categories based on your schema
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'luxury_logo_collections', name: 'Luxury Logo Collections', color: 'bg-purple-100 text-purple-800' },
    { id: 'branding_identity_packs', name: 'Branding Identity Packs', color: 'bg-blue-100 text-blue-800' },
    { id: 'social_media_kits', name: 'Social Media Kits', color: 'bg-pink-100 text-pink-800' },
    { id: 'posters_prints', name: 'Posters & Prints', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'mockups', name: 'Mockups', color: 'bg-green-100 text-green-800' },
    { id: '3d_fashion_assets', name: '3D Fashion Assets', color: 'bg-red-100 text-red-800' },
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active', color: 'text-green-700 bg-green-50 border-green-200' },
    { id: 'inactive', name: 'Inactive', color: 'text-gray-700 bg-gray-50 border-gray-200' },
  ];

  // Filter products based on search and filters
  const filteredProducts = adminProducts.filter(product => {
    const matchesSearch = 
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.categoryId === selectedCategory;
    
    const matchesStatus = selectedStatus === 'all' || (
      selectedStatus === 'active' ? product.isActive === true :
      selectedStatus === 'inactive' ? product.isActive === false :
      true
    );
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'title') {
      const aTitle = a.title || '';
      const bTitle = b.title || '';
      return sortOrder === 'asc' 
        ? aTitle.localeCompare(bTitle) 
        : bTitle.localeCompare(aTitle);
    }
    
    if (sortBy === 'price') {
      const aPrice = parseFloat(a.price) || 0;
      const bPrice = parseFloat(b.price) || 0;
      return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
    }
    
    // Default sort by createdAt
    const aDate = new Date(a.createdAt || 0);
    const bDate = new Date(b.createdAt || 0);
    return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
  });

  // Handle create product
  const handleCreateProduct = async (productData) => {
    try {
      const formData = new FormData();
      
      // Append all required fields
      formData.append('_id', productData._id);
      formData.append('title', productData.title);
      formData.append('slug', productData.slug);
      formData.append('collectionId', productData.collectionId);
      formData.append('categoryId', productData.categoryId);
      formData.append('price', productData.price);
      formData.append('currency', productData.currency);
      formData.append('type', productData.type);
      formData.append('description', productData.description || '');
      formData.append('useCases', productData.useCases || '');
      formData.append('isActive', productData.isActive);
      
      // Append formats as individual fields
      if (productData.formats && productData.formats.length > 0) {
        productData.formats.forEach(format => {
          formData.append('formats', format);
        });
      }
      
      // Append new images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          if (image.file) {
            formData.append('images', image.file);
          }
        });
      }
      
      await createProduct(formData);
      setIsModalOpen(false);
      setEditingProduct(null);
      
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(`Failed to create product: ${error.message}`);
    }
  };

  // Handle update product
  const handleUpdateProduct = async (productData) => {
    try {
      const formData = new FormData();
      
      // Append all fields (except _id which cannot be changed)
      formData.append('title', productData.title);
      formData.append('slug', productData.slug);
      formData.append('collectionId', productData.collectionId);
      formData.append('categoryId', productData.categoryId);
      formData.append('price', productData.price);
      formData.append('currency', productData.currency);
      formData.append('type', productData.type);
      formData.append('description', productData.description || '');
      formData.append('useCases', productData.useCases || '');
      formData.append('isActive', productData.isActive);
      
      // Append formats as individual fields
      if (productData.formats && productData.formats.length > 0) {
        productData.formats.forEach(format => {
          formData.append('formats', format);
        });
      }
      
      // Append new images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          if (image.file) {
            formData.append('images', image.file);
          }
        });
      }
      
      await updateProduct(productData._id, formData);
      setIsModalOpen(false);
      setEditingProduct(null);
      
    } catch (error) {
      console.error('Failed to update product:', error);
      alert(`Failed to update product: ${error.message}`);
    }
  };

  // Handle delete click - opens confirmation modal
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert(`Failed to delete product: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setProductToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Handle toggle product status
  const handleToggleStatus = async (id) => {
    try {
      await toggleProductStatus(id);
    } catch (error) {
      console.error('Failed to toggle product status:', error);
      alert(`Failed to toggle status: ${error.message}`);
    }
  };

  // Handle edit click
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Handle create click
  const handleCreateClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Handle modal save
  const handleModalSave = (productData) => {
    if (editingProduct) {
      handleUpdateProduct({ ...editingProduct, ...productData });
    } else {
      handleCreateProduct(productData);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId || 'Uncategorized';
  };

  // Get category color
  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  // Get product title by ID for confirmation modal
  const getProductTitle = (id) => {
    const product = adminProducts.find(p => p._id === id);
    return product ? product.title : 'this product';
  };

  if (isAdminLoading && adminProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Products Management</h1>
          <p className="text-gray-500 mt-1">Manage your design products and services</p>
          <p className="text-sm text-indigo-600 mt-1">
            📦 Real-time updates enabled | Products: {adminProducts.length}
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-indigo-400 shadow-md transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{adminProducts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Active Products</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {adminProducts.filter(p => p.isActive === true).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${adminProducts.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">
            {new Set(adminProducts.map(p => p.categoryId)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by title, description, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <TagIcon className="h-5 w-5 text-gray-500" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)} 
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)} 
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Products ({sortedProducts.length})</h3>
          <p className="text-sm text-gray-500">Showing {sortedProducts.length} of {adminProducts.length}</p>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.title)}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <PhotoIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {product.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          ID: {product._id}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          Slug: {product.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.categoryId)}`}>
                        {getCategoryName(product.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900">
                          ${parseFloat(product.price || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.currency || 'USD'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Type: {product.type || 'standalone'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.formats && product.formats.length > 0 ? (
                          product.formats.slice(0, 3).map((format, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {format}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No formats</span>
                        )}
                        {product.formats && product.formats.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.formats.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(product._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                          product.isActive
                            ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                            : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <CheckIcon className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XMarkIcon className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product._id)} 
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={handleCancelDelete} />
          
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full max-w-lg">
              {/* Header */}
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="ml-4 mt-1 text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">"{getProductTitle(productToDelete)}"</span>?
                      </p>
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ This action cannot be undone. All associated data will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  disabled={deleteLoading}
                  className="mt-3 sm:mt-0 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Product'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateServiceModal 
              onClose={handleModalClose} 
              onCreate={handleModalSave} 
              product={editingProduct}
              categories={categories.filter(c => c.id !== 'all')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;