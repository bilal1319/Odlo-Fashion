import { create } from 'zustand';
import axios from '../utils/axiosInstance';

const useAuthStore = create((set, get) => ({
  // State (IN MEMORY ONLY - not persisted)
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  // Login function
  signin: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });
      
      const userData = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role
      };
      
      // Set state IN MEMORY ONLY
      set({ 
        user: userData,
        isAuthenticated: true,
        isLoading: false 
      });
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },

  // Signup start (send verification email)
signupStart: async (email) => {
  try {
    set({ isLoading: true, error: null });
    
    const response = await axios.post('/auth/signup/start', { email });
    
    set({ isLoading: false });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Signup failed';
    set({ 
      error: errorMessage,
      isLoading: false 
    });
    throw error;
  }
},

// Verify email code
verifyEmailCode: async (token, code) => {
  try {
    set({ isLoading: true, error: null });
    
    const response = await axios.post('/auth/signup/verify', {
      token,
      code
    });
    
    set({ isLoading: false });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Verification failed';
    set({ 
      error: errorMessage,
      isLoading: false 
    });
    throw error;
  }
},

// Complete signup with password
signupComplete: async (token, password) => {
  try {
    set({ isLoading: true, error: null });
    
    const response = await axios.post('/auth/signup/complete', {
      token,
      password
    });
    
    // Set user state after successful signup
    const userData = {
      id: response.data.user.id,
      username: response.data.user.username,
      email: response.data.user.email,
      role: response.data.user.role
    };
    
    set({ 
      user: userData,
      isAuthenticated: true,
      isLoading: false 
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Account creation failed';
    set({ 
      error: errorMessage,
      isLoading: false 
    });
    throw error;
  }
},

  // Admin login
  adminLogin: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axios.post('/auth/admin/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username || 'Admin',
          email: response.data.user.email,
          role: response.data.user.role || 'admin'
        };
        
        set({ 
          user: userData,
          isAuthenticated: true,
          isLoading: false 
        });
        
        return response.data;
      }
      throw new Error('Admin login failed');
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Admin login failed',
        isLoading: false 
      });
      throw error;
    }
  },

  // CRITICAL: Always verify with backend
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const response = await axios.get('/auth/check');
      
      if (response.data.success) {
        const userData = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role
        };
        
        set({ 
          user: userData,
          isAuthenticated: true,
          isLoading: false 
        });
        
        return { success: true, user: userData };
      }
      throw new Error('Not authenticated');
    } catch (error) {
      // Clear state if backend says we're not authenticated
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false 
      });
      return { success: false };
    }
  },

  // Logout
  logout: async () => {
    try {
      const res = await axios.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear in-memory state
      set({ 
        user: null,
        isAuthenticated: false,
        error: null 
      });
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;