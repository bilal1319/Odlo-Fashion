import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../utils/axiosInstance';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      signin: async (email, password, rememberMe = false) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log("Attempting login with:", email);
          
          const response = await axios.post('/auth/login', {
            email,
            password
          });
          
          console.log("Login response:", response.data);
          
          const userData = {
            id: response.data.user.id || response.data.user._id,
            username: response.data.user.username,
            email: response.data.user.email || email,
            role: response.data.user.role
          };
          
          console.log("Setting user data:", userData);
          
          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false 
          });
          
          return response.data;
        } catch (error) {
          console.error("Login error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Login failed. Please check your credentials.';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // Admin login function
      adminLogin: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log("Attempting admin login with:", email);
          
          const response = await axios.post('/auth/admin/login', {
            email,
            password
          });
          
          console.log("Admin login response:", response.data);
          
          if (response.data.success && response.data.user) {
            const userData = {
              id: response.data.user.id || response.data.user._id,
              username: response.data.user.username || response.data.user.name || 'Admin',
              email: response.data.user.email || email,
              role: response.data.user.role || 'admin'
            };
            
            console.log("Setting admin user data:", userData);
            
            set({ 
              user: userData,
              isAuthenticated: true,
              isLoading: false 
            });
            
            return response.data;
          } else {
            throw new Error('Admin login failed: Invalid response');
          }
        } catch (error) {
          console.error("Admin login error:", error);
          
          const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Admin login failed. Please check your credentials.';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // Signup function
      signup: async ({ username, email, password }) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axios.post('/auth/register', {
            username,
            email,
            password
          });

          const userData = {
            ...response.data.user,
            username: response.data.user.username
          };

          set({ 
            user: userData,
            isAuthenticated: true,
            isLoading: false 
          });

          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // Auth check on page reload/refresh
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          
          const response = await axios.get('/auth/check');
          
          if (response.data.success && response.data.user) {
            const userData = {
              ...response.data.user,
              username: response.data.user.name || response.data.user.username
            };
            
            set({ 
              user: userData,
              isAuthenticated: true,
              isLoading: false 
            });
            
            return response.data;
          } else {
            throw new Error('Authentication check failed');
          }
        } catch (error) {
          // If auth check fails, user is not authenticated
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false 
          });
          console.error('Auth check failed:', error.message);
          return null;
        }
      },

      // Logout function
      logout: async () => {
        try {
          const response = await axios.get('/auth/logout');
          console.log('Logout response:', response.data);
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null,
            isAuthenticated: false,
            error: null 
          });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      // Store only non-sensitive data
      partialize: (state) => ({
        user: state.user ? {
          id: state.user.id || state.user._id,
          username: state.user.username,
          email: state.user.email,
          role: state.user.role
        } : null,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;