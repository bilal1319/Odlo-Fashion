// stores/adminBundleStore.js
import { create } from 'zustand';
import axios from '../utils/axiosInstance';
import { getIO } from '../utils/socketClient';

const useAdminBundlesStore = create((set, get) => ({
  // ========== REGULAR BUNDLES STATE ==========
  adminBundles: [],
  adminBundle: null,
  
  // ========== MASTER BUNDLES STATE ==========
  adminMasterBundles: [],
  adminMasterBundle: null,
  
  // ========== LOADING STATES ==========
  isAdminLoading: false,
  isMasterLoading: false,
  isCreating: false,
  isCreatingMaster: false,
  isUpdating: false,
  isUpdatingMaster: false,
  isDeleting: false,
  isDeletingMaster: false,
  isTogglingStatus: false,
  isTogglingMasterStatus: false,
  
  // ========== ERROR STATES ==========
  adminError: null,
  masterError: null,
  createError: null,
  createMasterError: null,
  updateError: null,
  updateMasterError: null,
  deleteError: null,
  deleteMasterError: null,
  
  // ========== REGULAR BUNDLES CRUD OPERATIONS ==========
  
  // Create bundle
  createBundle: async (formData) => {
    try {
      set({ isCreating: true, createError: null });
      
      const response = await axios.post('/admin/bundles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket event for real-time update
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('bundle:changed');
        console.log('📦 Emitted bundle:changed event');
      }
      
      set({ isCreating: false });
      
      return response.data;
    } catch (error) {
      console.error('Create bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create bundle';
      
      set({ createError: errorMessage, isCreating: false });
      throw new Error(errorMessage);
    }
  },
  
  // Update bundle
  updateBundle: async (id, formData) => {
    try {
      set({ isUpdating: true, updateError: null });
      
      const response = await axios.put(`/admin/bundles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('bundle:changed');
        console.log('📦 Emitted bundle:changed event');
      }
      
      set({ isUpdating: false });
      return response.data;
    } catch (error) {
      console.error('Update bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update bundle';
      
      set({ updateError: errorMessage, isUpdating: false });
      throw new Error(errorMessage);
    }
  },
  
  // Delete bundle
  deleteBundle: async (id) => {
    try {
      set({ isDeleting: true, deleteError: null });
      
      await axios.delete(`/admin/bundles/${id}`);
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('bundle:deleted', { id });
        console.log('🗑️ Emitted bundle:deleted event');
      }
      
      set({ isDeleting: false });
      return true;
    } catch (error) {
      console.error('Delete bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to delete bundle';
      
      set({ deleteError: errorMessage, isDeleting: false });
      throw new Error(errorMessage);
    }
  },
  
  // Toggle bundle status
  toggleBundleStatus: async (id) => {
    try {
      set({ isTogglingStatus: true });
      
      const response = await axios.patch(`/admin/bundles/${id}/status`);
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('bundle:changed');
        console.log('🔄 Emitted bundle:changed event');
      }
      
      set({ isTogglingStatus: false });
      return response.data;
    } catch (error) {
      console.error('Toggle bundle status error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to toggle bundle status';
      
      set({ updateError: errorMessage, isTogglingStatus: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get single bundle for editing
  getBundleById: async (id) => {
    try {
      set({ isAdminLoading: true, adminError: null });
      
      const response = await axios.get(`/admin/bundles/${id}`);
      
      set({ 
        adminBundle: response.data,
        isAdminLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Get bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to load bundle';
      
      set({ adminError: errorMessage, isAdminLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get all admin bundles (with filter)
  getAdminBundles: async (params = {}) => {
    try {
      set({ isAdminLoading: true, adminError: null });
      
      const response = await axios.get('/admin/bundles', { params });
      console.log('Admin bundles response:', response.data);
      
      set({ 
        adminBundles: response.data,
        isAdminLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Get admin bundles error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch bundles';
      
      set({ adminError: errorMessage, isAdminLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get bundle by slug (for frontend preview)
  getBundleBySlug: async (slug) => {
    try {
      set({ isAdminLoading: true });
      
      const response = await axios.get(`/admin/bundles/slug/${slug}`);
      
      set({ isAdminLoading: false });
      return response.data;
    } catch (error) {
      console.error('Get bundle by slug error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch bundle';
      
      set({ adminError: errorMessage, isAdminLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // ========== MASTER BUNDLES CRUD OPERATIONS ==========
  
  // Create master bundle
  createMasterBundle: async (formData) => {
    try {
      set({ isCreatingMaster: true, createMasterError: null });
      
      const response = await axios.post('/admin/master-bundles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket event for real-time update
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('masterBundle:changed');
        console.log('👑 Emitted masterBundle:changed event');
      }
      
      set({ isCreatingMaster: false });
      
      return response.data;
    } catch (error) {
      console.error('Create master bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create master bundle';
      
      set({ createMasterError: errorMessage, isCreatingMaster: false });
      throw new Error(errorMessage);
    }
  },
  
  // Update master bundle
  updateMasterBundle: async (id, formData) => {
    try {
      set({ isUpdatingMaster: true, updateMasterError: null });
      
      const response = await axios.put(`/admin/master-bundles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('masterBundle:changed');
        console.log('👑 Emitted masterBundle:changed event');
      }
      
      set({ isUpdatingMaster: false });
      return response.data;
    } catch (error) {
      console.error('Update master bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update master bundle';
      
      set({ updateMasterError: errorMessage, isUpdatingMaster: false });
      throw new Error(errorMessage);
    }
  },
  
  // Delete master bundle
  deleteMasterBundle: async (id) => {
    try {
      set({ isDeletingMaster: true, deleteMasterError: null });
      
      await axios.delete(`/admin/master-bundles/${id}`);
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('masterBundle:deleted', { id });
        console.log('🗑️ Emitted masterBundle:deleted event');
      }
      
      set({ isDeletingMaster: false });
      return true;
    } catch (error) {
      console.error('Delete master bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to delete master bundle';
      
      set({ deleteMasterError: errorMessage, isDeletingMaster: false });
      throw new Error(errorMessage);
    }
  },
  
  // Toggle master bundle status
  toggleMasterBundleStatus: async (id) => {
    try {
      set({ isTogglingMasterStatus: true });
      
      const response = await axios.patch(`/admin/master-bundles/${id}/status`);
      
      // Emit socket event
      const socket = getIO();
      if (socket && socket.connected) {
        socket.emit('masterBundle:changed');
        console.log('🔄 Emitted masterBundle:changed event');
      }
      
      set({ isTogglingMasterStatus: false });
      return response.data;
    } catch (error) {
      console.error('Toggle master bundle status error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to toggle master bundle status';
      
      set({ updateMasterError: errorMessage, isTogglingMasterStatus: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get single master bundle for editing
  getMasterBundleById: async (id) => {
    try {
      set({ isMasterLoading: true, masterError: null });
      
      const response = await axios.get(`/admin/master-bundles/${id}`);
      
      set({ 
        adminMasterBundle: response.data,
        isMasterLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Get master bundle error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to load master bundle';
      
      set({ masterError: errorMessage, isMasterLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get all admin master bundles (with filter)
  getAdminMasterBundles: async (params = {}) => {
    try {
      set({ isMasterLoading: true, masterError: null });
      
      const response = await axios.get('/admin/master-bundles', { params });

      console.log('Admin master bundles response:', response.data);
      
      set({ 
        adminMasterBundles: response.data,
        isMasterLoading: false
      });
      
      return response.data;
    } catch (error) {
      console.error('Get admin master bundles error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch master bundles';
      
      set({ masterError: errorMessage, isMasterLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // Get master bundle by slug (for frontend preview)
  getMasterBundleBySlug: async (slug) => {
    try {
      set({ isMasterLoading: true });
      
      const response = await axios.get(`/admin/master-bundles/slug/${slug}`);
      
      set({ isMasterLoading: false });
      return response.data;
    } catch (error) {
      console.error('Get master bundle by slug error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch master bundle';
      
      set({ masterError: errorMessage, isMasterLoading: false });
      throw new Error(errorMessage);
    }
  },
  
  // ========== UTILITY METHODS ==========
  
  // Clear all regular bundle state
  clearBundleState: () => set({
    adminBundle: null,
    adminError: null,
    createError: null,
    updateError: null,
    deleteError: null
  }),
  
  // Clear all master bundle state
  clearMasterBundleState: () => set({
    adminMasterBundle: null,
    masterError: null,
    createMasterError: null,
    updateMasterError: null,
    deleteMasterError: null
  }),
  
  // Clear all state
  clearAllState: () => set({
    // Regular bundles
    adminBundle: null,
    adminError: null,
    createError: null,
    updateError: null,
    deleteError: null,
    
    // Master bundles
    adminMasterBundle: null,
    masterError: null,
    createMasterError: null,
    updateMasterError: null,
    deleteMasterError: null,
    
    // Loading states
    isCreating: false,
    isCreatingMaster: false,
    isUpdating: false,
    isUpdatingMaster: false,
    isDeleting: false,
    isDeletingMaster: false,
    isTogglingStatus: false,
    isTogglingMasterStatus: false
  })
}));

export default useAdminBundlesStore;