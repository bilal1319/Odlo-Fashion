import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import useProductsStore from '../store/productsSrtore';
import { getIO } from '../utils/socketClient';
import { 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

const Services = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("luxury-logo-collections");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  const { 
    getAllProducts, 
    products, 
    isProductsLoading 
  } = useProductsStore();

  // Map URL hash to backend categoryId
  const categoryMapping = {
    "luxury-logo-collections": "luxury_logo_collections",
    "branding-identity-packs": "branding_identity_packs",
    "social-media-kits": "social_media_kits",
    "posters-prints": "posters_prints",
    "mockups": "mockups",
    "3d-fashion-assets": "3d_fashion_assets"
  };

  // Enhanced category information
  const categoryInfo = {
    "luxury-logo-collections": {
      title: "LUXURY LOGO COLLECTIONS",
      description: "Premium logo designs for elite brands and fashion houses",
      icon: "👑",
      features: ["Vector Files", "Unlimited Usage", "Source Files Included"]
    },
    "branding-identity-packs": {
      title: "BRANDING & IDENTITY PACKS",
      description: "Complete brand identity systems for fashion brands",
      icon: "🎨",
      features: ["Logo Variants", "Color Palette", "Typography Guide"]
    },
    "social-media-kits": {
      title: "SOCIAL MEDIA KITS",
      description: "Ready-to-use social media assets and templates",
      icon: "📱",
      features: ["Multiple Formats", "Platform Optimized", "Editable Files"]
    },
    "posters-prints": {
      title: "POSTERS & PRINTS",
      description: "High-resolution prints for fashion campaigns",
      icon: "🖼️",
      features: ["300 DPI", "Print Ready", "CMYK + RGB"]
    },
    "mockups": {
      title: "MOCKUPS",
      description: "Realistic product mockups for presentations",
      icon: "📦",
      features: ["PSD Files", "Smart Objects", "Multiple Angles"]
    },
    "3d-fashion-assets": {
      title: "3D FASHION ASSETS",
      description: "3D models and assets for fashion visualization",
      icon: "👕",
      features: ["3D Files", "Textures Included", "Multiple Formats"]
    }
  };

  const getCategoryFromHash = (hash) => {
    if (!hash) return "luxury-logo-collections";
    return hash.replace('#', '');
  };

  useEffect(() => {
    const categoryHash = getCategoryFromHash(location.hash);
    setSelectedCategory(categoryHash);
    window.scrollTo(0, 0);
  }, [location.hash]);

  useEffect(() => {
    const loadProducts = async () => {
      await getAllProducts();
    };
    loadProducts();
    
    const socket = getIO();
    if (socket) {
      socket.on('product:changed', () => {
        console.log('📦 Services page: Received product:changed event - refreshing products');
        getAllProducts();
      });
      
      socket.on('product:deleted', () => {
        console.log('🗑️ Services page: Received product:deleted event - refreshing products');
        getAllProducts();
      });
      
      socket.on('product:created', () => {
        console.log('🎉 Services page: Received product:created event - refreshing products');
        getAllProducts();
      });
    }
    
    return () => {
      if (socket) {
        socket.off('product:changed');
        socket.off('product:deleted');
        socket.off('product:created');
      }
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }
    
    const backendCategoryId = categoryMapping[selectedCategory];
    if (!backendCategoryId) return products;
    
    return products.filter(product => product.categoryId === backendCategoryId);
  }, [products, selectedCategory]);

  const getPlaceholderImage = (categoryId) => {
    const placeholders = {
      "luxury_logo_collections": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&q=80",
      "branding_identity_packs": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&h=400&fit=crop&q=80",
      "social_media_kits": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&q=80",
      "posters_prints": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=400&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop&q=80",
      "3d_fashion_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=600&h=400&fit=crop&q=80"
    };
    return placeholders[categoryId] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&q=80";
  };

  // Improved Loading State
  if (isProductsLoading && (!products || products.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="relative inline-block">
            {/* Outer ring */}
            <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
            {/* Spinning ring */}
            <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            {/* Center dot */}
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full animate-pulse"></div> */}
          </div>
          <p className="mt-8 text-xl font-medium text-gray-700 animate-pulse">
            Loading Premium Services...
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-r from-gray-900 to-primary mb-12">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {categoryInfo[selectedCategory]?.title}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              {categoryInfo[selectedCategory]?.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Products Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Featured Assets
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({filteredProducts.length} items)
              </span>
            </h2>
            <p className="text-gray-600">
              High-End Digital Assets for Fashion, Branding & Creative Studios
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, index) => (
              <div 
                key={product._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2 flex flex-col h-full"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <Link to={`/service/${product.slug}`} className="block">
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={product.images?.[0]?.url || product.image || product.thumbnail || getPlaceholderImage(product.categoryId)} 
                      alt={product.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredProduct === product._id ? 'scale-110' : 'scale-100'}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPlaceholderImage(product.categoryId);
                      }}
                    />
                    {/* Quick View Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6`}>
                      <span className="text-white text-sm font-medium flex items-center">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                {/* Product Content - Using flex-grow to push button to bottom */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/service/${product.slug}`}>
                      {product.title}
                    </Link>
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed grow">
                    {product.description || product.shortDescription || "Premium digital asset for your branding needs."}
                  </p>
                  
                  {/* Price & Action Section - Will always stay at bottom */}
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="shrink-0">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-mono  font-bold text-green-800">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                          )}
                        </div>
                        {product.originalPrice && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded mt-1 inline-block">
                            SAVE {Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      
                      <AddToCartButton 
                        item={{
                          ...product,
                          image: product.images?.[0]?.url || product.image || product.thumbnail || getPlaceholderImage(product.categoryId),
                          id: product._id,
                          name: product.title,
                          price: product.price
                        }}
                        type="product"
                        className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-primary to-gray-900 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center min-w-[120px] flex-shrink-0"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </AddToCartButton>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Improved Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Products Found
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-8">
              {!Array.isArray(products) || products.length === 0 
                ? "We're currently updating our collection. Please check back soon for amazing digital assets!"
                : "This category doesn't have any products available yet. Browse other categories to find what you need."}
            </p>
            {(!Array.isArray(products) || products.length === 0) && (
              <button 
                onClick={() => getAllProducts()}
                className="px-8 py-3 bg-linear-to-r from-primary to-gray-900 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Products
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;