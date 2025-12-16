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

      // Signin function
    // In signin function, add more debugging:
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
          await axios.get('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear store regardless of API call success
          set({ 
            user: null,
            isAuthenticated: false,
            error: null 
          });
        }
      },

      // Clear errors
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