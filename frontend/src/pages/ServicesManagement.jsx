// pages/ServicesManagement.jsx
import React, { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlusIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  TagIcon,
  CurrencyDollarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import CreateServiceModal from '../components/CreateServiceModal';

import {servicesData} from '../data/servicesData'
const flattenServicesData = () => {
  const flattened = [];
  Object.values(servicesData).forEach(categoryArray => {
    flattened.push(...categoryArray);
  });
  return flattened;
};

const ServicesManagement = () => {
  const [services, setServices] = useState(flattenServicesData());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'luxury-logo-collections', name: 'Luxury Logo Collections', color: 'bg-purple-100 text-purple-800' },
    { id: 'branding-identity-packs', name: 'Branding Identity Packs', color: 'bg-blue-100 text-blue-800' },
    { id: 'social-media-kits', name: 'Social Media Kits', color: 'bg-pink-100 text-pink-800' },
    { id: 'posters-prints', name: 'Posters & Prints', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'mockups', name: 'Mockups', color: 'bg-green-100 text-green-800' },
    { id: '3d-fashion-assets', name: '3D Fashion Assets', color: 'bg-red-100 text-red-800' },
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'active', name: 'Active', color: 'text-green-700 bg-green-50 border-green-200' },
    { id: 'draft', name: 'Draft', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    { id: 'archived', name: 'Archived', color: 'text-gray-700 bg-gray-50 border-gray-200' },
  ];

  // Add category and status to each service since they're not in the original data
  const enrichedServices = services.map(service => {
    // Find which category this service belongs to
    let category = '';
    Object.entries(servicesData).forEach(([catKey, catServices]) => {
      if (catServices.some(s => s.id === service.id)) {
        category = catKey;
      }
    });
    
    return {
      ...service,
      category: category,
      status: 'active', // Default status
      createdAt: '2024-01-15', // Default date
      features: "Multiple files, Commercial license, High quality" // Default features
    };
  });

  const filteredServices = enrichedServices.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'title') return sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    if (sortBy === 'price') return sortOrder === 'asc' 
      ? parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', '')) 
      : parseInt(b.price.replace('$', '')) - parseInt(a.price.replace('$', ''));
    return sortOrder === 'asc' 
      ? new Date(a.createdAt) - new Date(b.createdAt) 
      : new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, status: service.status === 'active' ? 'draft' : 'active' } : service
    ));
  };

  const handleCreateService = (serviceData) => {
    const newService = {
      id: services.length + 1,
      ...serviceData,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setServices([newService, ...services]);
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleEditService = (serviceData) => {
    setServices(services.map(service => 
      service.id === serviceData.id ? { ...service, ...serviceData } : service
    ));
    setIsModalOpen(false);
    setEditingService(null);
  };

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(c => c.id === category);
    return categoryObj ? categoryObj.color : 'bg-gray-100 text-gray-800';
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleModalSave = (serviceData) => {
    if (editingService) {
      handleEditService(serviceData);
    } else {
      handleCreateService(serviceData);
    }
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Services Management</h1>
          <p className="text-gray-500 mt-1">Manage your design services and products</p>
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-semibold hover:from-indigo-500 hover:to-indigo-400 shadow-md transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Services</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{enrichedServices.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Active Services</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{enrichedServices.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${enrichedServices.reduce((sum, s) => sum + parseInt(s.price.replace('$', '')), 0)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{categories.length - 1}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search services..."
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
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
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
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            {sortOrder === 'asc' ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Services ({sortedServices.length})</h3>
          <p className="text-sm text-gray-500">Showing {sortedServices.length} of {enrichedServices.length}</p>
        </div>

        {sortedServices.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p>No services found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Use Case</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedServices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{service.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{service.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                        {categories.find(c => c.id === service.category)?.name || service.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{service.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{service.useCase}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(service.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          service.status === 'active'
                            ? 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100'
                            : 'text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                        }`}
                      >
                        {service.status === 'active' ? "Active" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                     
                      <button 
                        onClick={() => handleEditClick(service)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)} 
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

      {/* Create/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateServiceModal 
              onClose={handleModalClose} 
              onCreate={handleModalSave} 
              service={editingService}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;