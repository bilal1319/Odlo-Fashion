import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';
import axiosInstance from '../utils/axiosInstance';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/orders/all');
      if (response.data.success) {
        setOrders(response.data.orders);
        console.log("orders", response.data.orders);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/admin/login');
      } else {
        setError('Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // WebSocket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket');
      setIsConnected(true);
      socket.emit('join-admin');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket');
      setIsConnected(false);
    });

    socket.on('new-order', (order) => {
      console.log('📦 New order received:', order);
      setOrders(prev => {
        const exists = prev.find(o => o._id === order._id);
        if (exists) return prev;
        return [order, ...prev];
      });
      setNewOrderAlert(order);
      setTimeout(() => setNewOrderAlert(null), 5000);
    });

    socket.on('order-status-changed', (updatedOrder) => {
      console.log('📝 Order status changed:', updatedOrder);
      setOrders(prev => 
        prev.map(order => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      setNewOrderAlert({ ...updatedOrder, isStatusChange: true });
      setTimeout(() => setNewOrderAlert(null), 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.stripe.sessionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* New Order Alert */}
      {newOrderAlert && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md animate-pulse ${
          newOrderAlert.isStatusChange ? 'bg-blue-500' : 'bg-green-500'
        } text-white`}>
          <div className="flex items-center space-x-3">
            <BellAlertIcon className="h-6 w-6" />
            <div>
              <p className="font-semibold">
                {newOrderAlert.isStatusChange ? 'Order Status Updated!' : 'New Order Received!'}
              </p>
              <p className="text-sm opacity-90">
                {newOrderAlert.email} - ${newOrderAlert.amountPaid?.toFixed(2)}
              </p>
              {newOrderAlert.isStatusChange && (
                <p className="text-xs opacity-75">Status: {newOrderAlert.status?.toUpperCase()}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500">Odlo Fashion</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`w-2 h-2 mr-1 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Site →
          </Link>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <ShoppingBagIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Orders</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {orders.filter(o => o.status === 'paid').length}
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl md:text-2xl">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                ${orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl md:text-2xl">$</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {new Set(orders.map(o => o.email)).size}
              </p>
            </div>
            <UserCircleIcon className="h-10 w-10 md:h-12 md:w-12 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by email or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            All Orders ({filteredOrders.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-600">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Order ID
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Customer Email
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Amount
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Services
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">
                        {order.stripe.sessionId.substring(0, 20)}...
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900 truncate max-w-[150px] md:max-w-[250px]">
                          {order.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${order.amountPaid?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.currency || 'USD'}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                      {order.testMode && (
                        <div className="text-xs text-orange-600 mt-1">TEST</div>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="max-w-xs">
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-1">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="text-xs text-gray-600 truncate">
                                {item.title || item.name} ×{item.quantity || 1}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{order.items.length - 3} more items
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">No items</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;