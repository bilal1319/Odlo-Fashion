// pages/BundlesManagement.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlusIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import CreateBundleModal from '../components/CreateBundleModal';
import useAdminBundleStore from "../store/adminBundlesStore";
import { getIO } from '../utils/socketClient';
import useProductsStore from '../store/productsSrtore';

const BundlesManagement = () => {
  // Use admin bundle store
  const {
    // Regular bundles
    adminBundles,
    adminMasterBundles,
    getAdminBundles,
    getAdminMasterBundles,
    deleteBundle,
    deleteMasterBundle,
    toggleBundleStatus,
    toggleMasterBundleStatus,
    isAdminLoading,
    isMasterLoading,
    adminError,
    masterError
  } = useAdminBundleStore();

  const { getBundles } = useProductsStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState(null);
  const [deleteIsMaster, setDeleteIsMaster] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Combine bundles and master bundles
  const allBundles = [
    ...adminBundles.map(b => ({ ...b, isMasterBundle: false })),
    ...adminMasterBundles.map(b => ({ ...b, isMasterBundle: true }))
  ];

  // Fetch bundles on mount
  useEffect(() => {
    fetchBundles();
    
    // Set up socket listener for real-time updates
    const socket = getIO();
    if (socket) {
      socket.on('bundle:changed', () => {
        console.log('📦 Received bundle:changed event - refreshing data');
        fetchBundles();
        getBundles()
      });
      
      socket.on('masterBundle:changed', () => {
        console.log('👑 Received masterBundle:changed event - refreshing data');
        fetchBundles();
        getBundles()
      });
      
      socket.on('bundle:deleted', (data) => {
        console.log('🗑️ Received bundle:deleted event', data);
        fetchBundles();
        getBundles()
      });
      
      socket.on('masterBundle:deleted', (data) => {
        console.log('🗑️ Received masterBundle:deleted event', data);
        fetchBundles();
        getBundles()
      });
    }
    
    return () => {
      if (socket) {
        socket.off('bundle:changed');
        socket.off('masterBundle:changed');
        socket.off('bundle:deleted');
        socket.off('masterBundle:deleted');
      }
    };
  }, []);

  const fetchBundles = async () => {
    try {
      await Promise.all([
        getAdminBundles(),
        getAdminMasterBundles()
      ]);
    } catch (error) {
      console.error('Failed to fetch bundles:', error);
    }
  };

  // Collection types for filtering
  const collectionTypes = [
    { id: 'all', name: 'All Types', color: 'bg-gray-100 text-gray-800' },
    { id: 'ultimate_packs', name: 'Ultimate Packs', color: 'bg-blue-100 text-blue-800' },
    { id: 'master_bundle', name: 'Master Bundle', color: 'bg-purple-100 text-purple-800' },
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active', color: 'text-green-700 bg-green-50 border-green-200' },
    { id: 'inactive', name: 'Inactive', color: 'text-gray-700 bg-gray-50 border-gray-200' },
  ];

  // Filter bundles based on search and filters
  const filteredBundles = allBundles.filter(bundle => {
    const matchesSearch = 
      bundle.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      selectedType === 'all' || 
      bundle.collectionId === selectedType;
    
    const matchesStatus = selectedStatus === 'all' || (
      selectedStatus === 'active' ? bundle.isActive === true :
      selectedStatus === 'inactive' ? bundle.isActive === false :
      true
    );
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort bundles
  const sortedBundles = [...filteredBundles].sort((a, b) => {
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
    
    if (sortBy === 'items') {
      const aItems = a.isMasterBundle ? (a.includedBundles?.length || 0) : (a.includedProducts?.length || 0);
      const bItems = b.isMasterBundle ? (b.includedBundles?.length || 0) : (b.includedProducts?.length || 0);
      return sortOrder === 'asc' ? aItems - bItems : bItems - aItems;
    }
    
    // Default sort by createdAt
    const aDate = new Date(a.createdAt || 0);
    const bDate = new Date(b.createdAt || 0);
    return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
  });

  // Handle delete click
  const handleDeleteClick = (id, isMaster) => {
    setBundleToDelete(id);
    setDeleteIsMaster(isMaster);
    setShowDeleteConfirm(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!bundleToDelete) return;
    
    setDeleteLoading(true);
    try {
      if (deleteIsMaster) {
        await deleteMasterBundle(bundleToDelete);
      } else {
        await deleteBundle(bundleToDelete);
      }
      setBundleToDelete(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete bundle:', error);
      alert(`Failed to delete bundle: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setBundleToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Handle toggle bundle status
  const handleToggleStatus = async (id, isMaster) => {
    try {
      if (isMaster) {
        await toggleMasterBundleStatus(id);
      } else {
        await toggleBundleStatus(id);
      }
    } catch (error) {
      console.error('Failed to toggle bundle status:', error);
      alert(`Failed to toggle status: ${error.message}`);
    }
  };

  // Handle edit click
  const handleEditClick = (bundle) => {
    setEditingBundle(bundle);
    setIsModalOpen(true);
  };

  // Handle create click
  const handleCreateClick = () => {
    setEditingBundle(null);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBundle(null);
  };

  // Get collection type name
  const getCollectionName = (collectionId) => {
    const type = collectionTypes.find(c => c.id === collectionId);
    return type ? type.name : collectionId || 'Unknown';
  };

  // Get collection color
  const getCollectionColor = (collectionId) => {
    const type = collectionTypes.find(c => c.id === collectionId);
    return type ? type.color : 'bg-gray-100 text-gray-800';
  };

  // Get bundle title by ID
  const getBundleTitle = (id, isMaster) => {
    const bundles = isMaster ? adminMasterBundles : adminBundles;
    const bundle = bundles.find(b => b._id === id);
    return bundle ? bundle.title : 'this bundle';
  };

  // Get items count
  const getItemsCount = (bundle) => {
    if (bundle.isMasterBundle) {
      return bundle.includedBundles?.length || 0;
    } else {
      return bundle.includedProducts?.length || 0;
    }
  };

  if ((isAdminLoading || isMasterLoading) && allBundles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading bundles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bundles Management</h1>
          <p className="text-gray-500 mt-1">Manage your product bundles and special offers</p>
          <p className="text-sm text-indigo-600 mt-1">
            📦 Real-time updates enabled | Bundles: {allBundles.length} | Master Bundles: {adminMasterBundles.length}
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-indigo-400 shadow-md transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Bundle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Bundles</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{allBundles.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Active Bundles</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {allBundles.filter(b => b.isActive === true).length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${allBundles.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Master Bundles</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">
            {adminMasterBundles.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search bundles by title or ID..."
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
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)} 
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {collectionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
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
            <option value="items">Sort by Items</option>
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Bundles Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Bundles ({sortedBundles.length})</h3>
          <p className="text-sm text-gray-500">Showing {sortedBundles.length} of {allBundles.length}</p>
        </div>

        {sortedBundles.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p>No bundles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bundle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBundles.map(bundle => (
                  <tr key={bundle._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {bundle.images && bundle.images[0] ? (
                          <img 
                            src={bundle.images[0].url} 
                            alt={bundle.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(bundle.title)}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg">
                            {bundle.isMasterBundle ? <StarIcon className="h-6 w-6 text-yellow-500" /> : "📦"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">
                            {bundle.title}
                          </p>
                          {bundle.isMasterBundle && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Master
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          ID: {bundle._id}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          Slug: {bundle.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCollectionColor(bundle.collectionId)}`}>
                        {getCollectionName(bundle.collectionId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-gray-900">
                          ${parseFloat(bundle.price || 0).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {bundle.currency || 'USD'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                          {getItemsCount(bundle)} {bundle.isMasterBundle ? 'bundles' : 'products'}
                        </span>
                        {bundle.bonuses?.length > 0 && (
                          <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium">
                            {bundle.bonuses?.length || 0} bonuses
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(bundle._id, bundle.isMasterBundle)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition flex items-center gap-1 ${
                          bundle.isActive
                            ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                            : 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {bundle.isActive ? (
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
                        onClick={() => handleEditClick(bundle)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(bundle._id, bundle.isMasterBundle)} 
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
                      Delete {deleteIsMaster ? 'Master Bundle' : 'Bundle'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">"{getBundleTitle(bundleToDelete, deleteIsMaster)}"</span>?
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
                    `Delete ${deleteIsMaster ? 'Master Bundle' : 'Bundle'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Bundle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateBundleModal 
              onClose={handleModalClose} 
              onCreate={handleModalClose}
              bundle={editingBundle}
              allRegularBundles={adminBundles}
              allProducts={[]} // You'll need to fetch products from your products store
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BundlesManagement;