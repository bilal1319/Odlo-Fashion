// stores/adminProductsStore.js
import { create } from 'zustand';
import axios from '../utils/axiosInstance';
import { getIO } from '../utils/socketClient';

const useAdminProductsStore = create((set, get) => ({
  // Admin products state
  adminProducts: [],
  adminProduct: null,
  
  // Admin loading states
  isAdminLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  
  // Admin errors
  adminError: null,
  createError: null,
  updateError: null,
  deleteError: null,
  
  // ========== ADMIN CRUD OPERATIONS ==========
  
  // Create product
  createProduct: async (formData) => {
    try {
      set({ isCreating: true, createError: null });
      
      const response = await axios.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket event for real-time update
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('product:changed');
        console.log('📦 Emitted product:changed event');
      }
      
      set({ isCreating: false });
      
      return response.data;
    } catch (error) {
      console.error('Create product error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create product';
      
      set({ createError: errorMessage, isCreating: false });
      throw new Error(errorMessage);
    }
  },
  
  // Update product
  updateProduct: async (id, formData) => {
    try {
      set({ isUpdating: true, updateError: null });
      
      const response = await axios.put(`/admin/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('product:changed');
        console.log('📦 Emitted product:changed event');
      }
      
      set({ isUpdating: false });
      return response.data;
    } catch (error) {
      console.error('Update product error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update product';
      
      set({ updateError: errorMessage, isUpdating: false });
      throw new Error(errorMessage);
    }
  },
  
  // Delete product
  deleteProduct: async (id) => {
    try {
      set({ isDeleting: true, deleteError: null });
      
      await axios.delete(`/admin/products/${id}`);
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('product:deleted', { id });
        console.log('🗑️ Emitted product:deleted event');
      }
      
      set({ isDeleting: false });
      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to delete product';
      
      set({ deleteError: errorMessage, isDeleting: false });
      throw new Error(errorMessage);
    }
  },
  
  // Toggle product status
  toggleProductStatus: async (id) => {
    try {
      set({ isUpdating: true });
      
      const response = await axios.patch(`/admin/products/${id}/status`);
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('product:changed');
        console.log('🔄 Emitted product:changed event');
      }
      
      set({ isUpdating: false });
      return response.data;
    } catch (error) {
      console.error('Toggle product status error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to toggle product status';
      
      set({ updateError: errorMessage, isUpdating: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get single product for editing
  getProductById: async (id) => {
    try {
      set({ isAdminLoading: true, adminError: null });
      
      const response = await axios.get(`/admin/products/${id}`);
      
      set({ 
        adminProduct: response.data,
        isAdminLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Get product error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to load product';
      
      set({ adminError: errorMessage, isAdminLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get all admin products (with filter)
  getAdminProducts: async (params = {}) => {
    try {
      set({ isAdminLoading: true, adminError: null });
      
      const response = await axios.get('/admin/products', { params });
      
      set({ 
        adminProducts: response.data,
        isAdminLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Get admin products error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch products';
      
      set({ adminError: errorMessage, isAdminLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Clear admin state
  clearAdminState: () => set({
    adminProduct: null,
    adminError: null,
    createError: null,
    updateError: null,
    deleteError: null
  })
}));

export default useAdminProductsStore;