// pages/BundlesManagement.jsx
import React, { useState, useRef } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlusIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import CreateBundleModal from '../components/CreateBundleModal';

// Sample data for bundles
const sampleBundles = [
  { id: 1, title: "Full Branding Studio Bundle", type: "full_branding", price: "$800", originalPrice: "$1200", status: "active", createdAt: "2024-01-15", itemsCount: 15, isMasterBundle: false },
  { id: 2, title: "Poster Mega Pack", type: "poster_pack", price: "$800", originalPrice: "$1000", status: "active", createdAt: "2024-01-16", itemsCount: 25, isMasterBundle: false },
  { id: 3, title: "3D Accessories Collection", type: "3d_assets", price: "$800", originalPrice: "$900", status: "draft", createdAt: "2024-01-17", itemsCount: 10, isMasterBundle: false },
  { id: 4, title: "Ultimate Fashion Bundle", type: "ultimate", price: "$1500", originalPrice: "$2500", status: "active", createdAt: "2024-01-18", itemsCount: 50, isMasterBundle: true },
  { id: 5, title: "Social Media Master Bundle", type: "social_media", price: "$800", originalPrice: "$1100", status: "active", createdAt: "2024-01-19", itemsCount: 30, isMasterBundle: false },
];

const BundlesManagement = () => {
  const [bundles, setBundles] = useState(sampleBundles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const modalRef = useRef(null);

  const bundleTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'full_branding', name: 'Full Branding', color: 'bg-purple-100 text-purple-800' },
    { id: 'poster_pack', name: 'Poster Pack', color: 'bg-blue-100 text-blue-800' },
    { id: '3d_assets', name: '3D Assets', color: 'bg-green-100 text-green-800' },
    { id: 'social_media', name: 'Social Media', color: 'bg-pink-100 text-pink-800' },
    { id: 'mockups', name: 'Mockups', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'ultimate', name: 'Ultimate', color: 'bg-red-100 text-red-800' },
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active', color: 'text-green-700 bg-green-50 border-green-200' },
    { id: 'draft', name: 'Draft', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    { id: 'archived', name: 'Archived', color: 'text-gray-700 bg-gray-50 border-gray-200' },
  ];

  const filteredBundles = bundles.filter(bundle => {
    const matchesSearch = bundle.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || bundle.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || bundle.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedBundles = [...filteredBundles].sort((a, b) => {
    if (sortBy === 'title') return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortBy === 'price') return sortOrder === 'asc' 
      ? parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', '')) 
      : parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''));
    if (sortBy === 'items') return sortOrder === 'asc' ? a.itemsCount - b.itemsCount : b.itemsCount - a.itemsCount;
    return sortOrder === 'asc' 
      ? new Date(a.createdAt) - new Date(b.createdAt) 
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bundle?')) {
      setBundles(bundles.filter(bundle => bundle.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setBundles(bundles.map(bundle => 
      bundle.id === id ? { ...bundle, status: bundle.status === 'active' ? 'draft' : 'active' } : bundle
    ));
  };

  const handleCreateBundle = (bundleData) => {
    const newBundle = {
      id: bundles.length + 1,
      ...bundleData,
      itemsCount: bundleData.items ? bundleData.items.split(',').length : 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      isMasterBundle: bundleData.type === 'ultimate'
    };
    setBundles([newBundle, ...bundles]);
    setIsModalOpen(false);
    setEditingBundle(null);
  };

  const handleEditBundle = (bundleData) => {
    setBundles(bundles.map(bundle => 
      bundle.id === bundleData.id ? { 
        ...bundle, 
        ...bundleData,
        itemsCount: bundleData.items ? bundleData.items.split(',').length : bundle.itemsCount,
        isMasterBundle: bundleData.type === 'ultimate'
      } : bundle
    ));
    setIsModalOpen(false);
    setEditingBundle(null);
  };

  const getBundleTypeColor = (type) => {
    const typeObj = bundleTypes.find(t => t.id === type);
    return typeObj ? typeObj.color : 'bg-gray-100 text-gray-800';
  };

  const handleEditClick = (bundle) => {
    setEditingBundle(bundle);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingBundle(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBundle(null);
  };

  const handleModalSave = (bundleData) => {
    if (editingBundle) {
      handleEditBundle(bundleData);
    } else {
      handleCreateBundle(bundleData);
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bundles Management</h1>
          <p className="text-gray-500 mt-1">Manage your product bundles and special offers</p>
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
          <p className="text-2xl font-bold text-gray-900 mt-1">{bundles.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Active Bundles</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{bundles.filter(b => b.status === 'active').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${bundles.reduce((sum, b) => sum + parseInt(b.price.replace('$', '')), 0)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Master Bundles</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{bundles.filter(b => b.isMasterBundle).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search bundles..."
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
              {bundleTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)} 
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statusOptions.map(status => <option key={status.id} value={status.id}>{status.name}</option>)}
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
          <p className="text-sm text-gray-500">Showing {sortedBundles.length} of {bundles.length}</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price & Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBundles.map(bundle => (
                  <tr key={bundle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg">
                        {bundle.isMasterBundle ? "⭐" : "📦"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{bundle.title}</p>
                        <p className="text-sm text-gray-500">Created: {bundle.createdAt}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getBundleTypeColor(bundle.type)}`}>
                        {bundleTypes.find(t => t.id === bundle.type)?.name || bundle.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{bundle.price}</p>
                      {bundle.originalPrice && (
                        <p className="text-xs text-green-600 mt-1">
                          Save ${parseInt(bundle.originalPrice.replace('$', '')) - parseInt(bundle.price.replace('$', ''))}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">{bundle.itemsCount} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(bundle.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          bundle.status === 'active'
                            ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                            : 'text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        {bundle.status === 'active' ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                     
                      <button 
                        onClick={() => handleEditClick(bundle)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(bundle.id)} 
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
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

      {/* Create/Edit Bundle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateBundleModal 
              onClose={handleModalClose} 
              onCreate={handleModalSave} 
              bundle={editingBundle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BundlesManagement;