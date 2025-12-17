import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../utils/axiosInstance';

const useProductsStore = create(
  persist(
    (set, get) => ({
      // Products state
      products: [],
      product: null,
      
      // Categories state
      categories: [],
      
      // Collections state
      collections: [],
      
      // Bundles state
      bundles: [],
      bundle: null,
      
      // Master bundles state
      masterBundles: [],
      
      // Loading states
      isLoading: false,
      isProductsLoading: false,
      isCategoriesLoading: false,
      isCollectionsLoading: false,
      isBundlesLoading: false,
      isMasterBundlesLoading: false,
      
      // Error states
      error: null,
      productsError: null,
      categoriesError: null,
      collectionsError: null,
      bundlesError: null,
      
      // Cache timestamps
      lastFetched: {
        products: null,
        categories: null,
        collections: null,
        bundles: null,
        masterBundles: null
      },

      // ========== PRODUCTS API FUNCTIONS ==========

      // Get all products
      getAllProducts: async (params = {}) => {
        try {
          set({ isProductsLoading: true, productsError: null });
          
          console.log("Fetching products with params:", params);
          
          const response = await axios.get('/products', { params });
          
          console.log("Products response:", response.data);
          
          // FIXED: Extract products from the correct path
          let productsData = [];
          
          if (response.data && response.data.success) {
            // Structure: {success: true, count: 60, data: Array(60)}
            productsData = response.data.data || [];
          } else if (Array.isArray(response.data)) {
            // Structure: [...]
            productsData = response.data;
          } else if (response.data && Array.isArray(response.data.products)) {
            // Structure: { products: [...] }
            productsData = response.data.products;
          }
          
          console.log("Extracted products data:", productsData.length, "items");
          
          set({ 
            products: productsData,
            isProductsLoading: false,
            lastFetched: { ...get().lastFetched, products: Date.now() }
          });
          
          return productsData;
        } catch (error) {
          console.error("Get products error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch products';
          
          set({ 
            productsError: errorMessage,
            isProductsLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // Get single product by slug
      getProductBySlug: async (slug) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log("Fetching product by slug:", slug);
          
          const response = await axios.get(`/products/${slug}`);
          
          console.log("Product response:", response.data);
          
          // FIXED: Extract product from the correct path
          let productData = null;
          
          if (response.data && response.data.success) {
            productData = response.data.data || response.data.product || response.data;
          } else {
            productData = response.data.product || response.data;
          }
          
          set({ 
            product: productData,
            isLoading: false
          });
          
          return productData;
        } catch (error) {
          console.error("Get product error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch product';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // ========== CATEGORIES API FUNCTIONS ==========

      getProductsByCategoryId: (categoryId) => {
        const state = get();
        if (!categoryId) return state.products;
        
        return state.products.filter(product => 
          product.categoryId === categoryId
        );
      },

      // Get all categories
      getCategories: async (params = {}) => {
        try {
          set({ isCategoriesLoading: true, categoriesError: null });
          
          console.log("Fetching categories with params:", params);
          
          const response = await axios.get('/categories', { params });
          
          console.log("Categories response:", response.data);
          
          // Handle different response structures
          let categoriesData = [];
          
          if (response.data && response.data.success) {
            // Structure: {success: true, count: 6, data: Array(6)}
            categoriesData = response.data.data || [];
          } else if (Array.isArray(response.data)) {
            // Structure: [...]
            categoriesData = response.data;
          } else if (response.data && Array.isArray(response.data.categories)) {
            // Structure: { categories: [...] }
            categoriesData = response.data.categories;
          }
          
          console.log("Extracted categories data:", categoriesData.length, "items");
          
          set({ 
            categories: categoriesData,
            isCategoriesLoading: false,
            lastFetched: { ...get().lastFetched, categories: Date.now() }
          });
          
          return categoriesData;
        } catch (error) {
          console.error("Get categories error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch categories';
          
          set({ 
            categoriesError: errorMessage,
            isCategoriesLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // ========== COLLECTIONS API FUNCTIONS ==========

      // Get all collections
      getCollections: async (params = {}) => {
        try {
          set({ isCollectionsLoading: true, collectionsError: null });
          
          console.log("Fetching collections with params:", params);
          
          const response = await axios.get('/collections', { params });
          
          console.log("Collections response:", response.data);
          
          // Handle different response structures
          let collectionsData = [];
          
          if (response.data && response.data.success) {
            collectionsData = response.data.data || [];
          } else if (Array.isArray(response.data)) {
            collectionsData = response.data;
          } else if (response.data && Array.isArray(response.data.collections)) {
            collectionsData = response.data.collections;
          }
          
          set({ 
            collections: collectionsData,
            isCollectionsLoading: false,
            lastFetched: { ...get().lastFetched, collections: Date.now() }
          });
          
          return collectionsData;
        } catch (error) {
          console.error("Get collections error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch collections';
          
          set({ 
            collectionsError: errorMessage,
            isCollectionsLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // ========== BUNDLES API FUNCTIONS ==========

      // Get all bundles
      getBundles: async (params = {}) => {
        try {
          set({ isBundlesLoading: true, bundlesError: null });
          
          console.log("Fetching bundles with params:", params);
          
          const response = await axios.get('/bundles', { params });
          
          console.log("Bundles response:", response.data);
          
          // Handle different response structures
          let bundlesData = [];
          
          if (response.data && response.data.success) {
            bundlesData = response.data.data || [];
          } else if (Array.isArray(response.data)) {
            bundlesData = response.data;
          } else if (response.data && Array.isArray(response.data.bundles)) {
            bundlesData = response.data.bundles;
          }
          
          set({ 
            bundles: bundlesData,
            isBundlesLoading: false,
            lastFetched: { ...get().lastFetched, bundles: Date.now() }
          });
          
          return bundlesData;
        } catch (error) {
          console.error("Get bundles error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch bundles';
          
          set({ 
            bundlesError: errorMessage,
            isBundlesLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // Get single bundle by slug
      getBundleBySlug: async (slug) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log("Fetching bundle by slug:", slug);
          
          const response = await axios.get(`/bundles/${slug}`);
          
          console.log("Bundle response:", response.data);
          
          // Handle different response structures
          let bundleData = null;
          
          if (response.data && response.data.success) {
            bundleData = response.data.data || response.data.bundle || response.data;
          } else {
            bundleData = response.data.bundle || response.data;
          }
          
          set({ 
            bundle: bundleData,
            isLoading: false
          });
          
          return bundleData;
        } catch (error) {
          console.error("Get bundle error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch bundle';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // ========== MASTER BUNDLES API FUNCTIONS ==========

      // Get all master bundles
      getMasterBundles: async (params = {}) => {
        try {
          set({ isMasterBundlesLoading: true, error: null });
          
          console.log("Fetching master bundles with params:", params);
          
          const response = await axios.get('/master-bundles', { params });
          
          console.log("Master bundles response:", response.data);
          
          // Handle different response structures
          let masterBundlesData = [];
          
          if (response.data && response.data.success) {
            masterBundlesData = response.data.data || response.data.bundles || response.data.masterBundles || [];
          } else if (Array.isArray(response.data)) {
            masterBundlesData = response.data;
          } else if (response.data && Array.isArray(response.data.bundles)) {
            masterBundlesData = response.data.bundles;
          } else if (response.data && Array.isArray(response.data.masterBundles)) {
            masterBundlesData = response.data.masterBundles;
          }
          
          set({ 
            masterBundles: masterBundlesData,
            isMasterBundlesLoading: false,
            lastFetched: { ...get().lastFetched, masterBundles: Date.now() }
          });
          
          return masterBundlesData;
        } catch (error) {
          console.error("Get master bundles error details:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          
          const errorMessage = error.response?.data?.message || 
                             error.message || 
                             'Failed to fetch master bundles';
          
          set({ 
            error: errorMessage,
            isMasterBundlesLoading: false 
          });
          throw new Error(errorMessage);
        }
      },

      // ========== HELPER FUNCTIONS ==========

      // Clear current product
      clearProduct: () => set({ product: null, error: null }),

      // Clear current bundle
      clearBundle: () => set({ bundle: null, error: null }),

      // Clear all errors
      clearErrors: () => set({ 
        error: null,
        productsError: null,
        categoriesError: null,
        collectionsError: null,
        bundlesError: null
      }),

      // Refresh all data (optional - for admin or cache invalidation)
      refreshAllData: async () => {
        try {
          set({ isLoading: true });
          
          await Promise.all([
            get().getAllProducts(),
            get().getCategories(),
            get().getCollections(),
            get().getBundles(),
            get().getMasterBundles()
          ]);
          
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      // Filter products by category
      getProductsByCategory: (categorySlug) => {
        const state = get();
        if (!categorySlug) return state.products;
        
        return state.products.filter(product => 
          product.category?.slug === categorySlug || 
          product.categorySlug === categorySlug
        );
      },

      // Filter products by collection
      getProductsByCollection: (collectionSlug) => {
        const state = get();
        if (!collectionSlug) return state.products;
        
        return state.products.filter(product => 
          product.collection?.slug === collectionSlug || 
          product.collectionSlug === collectionSlug
        );
      },

      // Search products
      searchProducts: (searchTerm) => {
        const state = get();
        if (!searchTerm) return state.products;
        
        const term = searchTerm.toLowerCase();
        return state.products.filter(product => 
          product.name?.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term)
        );
      },

      // Debug function
      getStoreDebugInfo: () => {
        const state = get();
        return {
          productsCount: state.products.length,
          categoriesCount: state.categories.length,
          isProductsLoading: state.isProductsLoading,
          products: state.products.slice(0, 3).map(p => ({
            title: p.title,
            categoryId: p.categoryId,
            _id: p._id
          }))
        };
      }
    }),
    {
      name: 'products-storage',
      // Only persist data that makes sense to cache
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        collections: state.collections,
        bundles: state.bundles,
        masterBundles: state.masterBundles,
        lastFetched: state.lastFetched
      }),
      // Optional: Add version for migrations
      version: 1
    }
  )
);

export default useProductsStore;