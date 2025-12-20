import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://odlo-fashion.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is CRITICAL for sending cookies
});

// Request interceptor - No need to add token manually
axiosInstance.interceptors.request.use(
  (config) => {
    // Cookies are automatically sent with withCredentials: true
    // You can add debug logging
    console.log(`Request to: ${config.url}`, {
      method: config.method,
      withCredentials: config.withCredentials
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response from: ${response.config.url}`, {
      status: response.status,
      success: response.data?.success
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message
    });
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401) {
      // Don't use localStorage
      // Redirect to login
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;