import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import useProductsStore from '../store/productsSrtore';
import { getIO } from '../utils/socketClient';
import { 
  ArrowRight,
  ShoppingBag,
  Package,
  Layers,
  Zap,
  Shield,
  Star
} from 'lucide-react';

const Bundles = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredBundle, setHoveredBundle] = useState(null);
  
  // Get bundles from store
  const { 
    getBundles, 
    bundles, 
    isBundlesLoading,
    getMasterBundles,
    masterBundles
  } = useProductsStore();

  // Fetch bundles on component mount and set up socket listeners
  useEffect(() => {
    const loadBundles = async () => {
      try {
        await getBundles();
        await getMasterBundles(); // If you have master bundles too
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load bundles:", error);
        setIsLoading(false);
      }
    };
    loadBundles();

    // Set up socket listeners for real-time updates
    const socket = getIO();
    if (socket) {
      // Listen for bundle changes (create, update, status toggle)
      socket.on('bundle:changed', () => {
        console.log('📦 Received bundle:changed event - refreshing bundles');
        getBundles();
      });
      
      // Listen for master bundle changes
      socket.on('masterBundle:changed', () => {
        console.log('👑 Received masterBundle:changed event - refreshing master bundles');
        getMasterBundles();
      });
      
      // Listen for bundle deletions
      socket.on('bundle:deleted', (data) => {
        console.log('🗑️ Received bundle:deleted event', data);
        getBundles();
      });
      
      // Listen for master bundle deletions
      socket.on('masterBundle:deleted', (data) => {
        console.log('🗑️ Received masterBundle:deleted event', data);
        getMasterBundles();
      });
    }
    
    // Clean up socket listeners when component unmounts
    return () => {
      if (socket) {
        socket.off('bundle:changed');
        socket.off('masterBundle:changed');
        socket.off('bundle:deleted');
        socket.off('masterBundle:deleted');
      }
    };
  }, [getBundles, getMasterBundles]);

  // Safely combine regular bundles and master bundles
  const allBundles = [
    ...(Array.isArray(bundles) ? bundles : []),
    ...(Array.isArray(masterBundles) ? masterBundles : [])
  ];

  // Bundle type information
  const bundleInfo = {
    "full_branding": {
      icon: "🎨",
      features: ["Logo Design", "Brand Guidelines", "Social Media Templates"]
    },
    "poster_pack": {
      icon: "🖼️",
      features: ["Multiple Sizes", "Print Ready", "Source Files"]
    },
    "3d_assets": {
      icon: "👕",
      features: ["3D Models", "Textures", "Multiple Formats"]
    },
    "social_media": {
      icon: "📱",
      features: ["All Platforms", "Editable Files", "Monthly Updates"]
    },
    "mockups": {
      icon: "📦",
      features: ["PSD Files", "Smart Objects", "Realistic Textures"]
    },
    "ultimate": {
      icon: "👑",
      features: ["Everything Included", "Priority Support", "Custom Work"]
    }
  };

  // Get placeholder image for bundle
  const getPlaceholderImage = (bundleType) => {
    const placeholders = {
      "full_branding": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&q=80",
      "poster_pack": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&h=400&fit=crop&q=80",
      "3d_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=600&h=400&fit=crop&q=80",
      "social_media": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop&q=80",
      "ultimate": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=600&h=400&fit=crop&q=80"
    };
    return placeholders[bundleType] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop&q=80";
  };

  // Get bundle type display name
  const getBundleTypeName = (type) => {
    const typeNames = {
      "full_branding": "Full Branding",
      "poster_pack": "Poster Pack",
      "3d_assets": "3D Assets",
      "social_media": "Social Media",
      "mockups": "Mockups",
      "ultimate": "Ultimate"
    };
    return typeNames[type] || "Bundle";
  };

  // Improved Loading State
  if (isBundlesLoading && (!allBundles || allBundles.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            {/* Outer ring */}
            <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
            {/* Spinning ring */}
            <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-8 text-xl font-medium text-gray-700 animate-pulse">
            Loading Bundles...
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16 ">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-primary mb-12">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              BUNDLES
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
              Complete brand-building systems engineered for creators who want to elevate every touchpoint with editorial sophistication and timeless luxury.
            </p>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bundles Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Value Bundles
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({allBundles.length} bundles)
              </span>
            </h2>
            <p className="text-gray-600">
              Curated collections offering maximum value and comprehensive solutions
            </p>
          </div>
          
        </div>

        {/* Bundles Grid */}
        {allBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allBundles.map((bundle) => (
              <div 
                key={bundle._id || bundle.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:-translate-y-2 flex flex-col h-full"
                onMouseEnter={() => setHoveredBundle(bundle._id || bundle.id)}
                onMouseLeave={() => setHoveredBundle(null)}
              >
                {/* Bundle Image */}
                <Link to={`/bundle/${bundle.slug}`} className="block">
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <img 
                      src={bundle.images?.[0]?.url || bundle.image || bundle.thumbnail || getPlaceholderImage(bundle.type)} 
                      alt={bundle.title || bundle.name}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-all duration-700 ${hoveredBundle === (bundle._id || bundle.id) ? 'scale-110' : 'scale-100'}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPlaceholderImage(bundle.type);
                      }}
                    />
                    
                    {/* Quick View Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6`}>
                      <span className="text-white text-sm font-medium flex items-center">
                        View Bundle Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </div>
                  </div>
                </Link>
                
                {/* Bundle Content - Using flex-grow to push button to bottom */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/bundle/${bundle.slug}`}>
                      {bundle.title || bundle.name}
                    </Link>
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed grow">
                    {bundle.description || bundle.shortDescription || "Complete bundle of premium digital assets for your branding needs."}
                  </p>
                  

                  
                  
                  {/* Price & Action Section - Will always stay at bottom */}
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="shrink-0">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-mono font-bold text-green-800">${bundle.price}</span>
                          {bundle.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${bundle.originalPrice}</span>
                          )}
                        </div>
                        {bundle.originalPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                              SAVE {Math.round((1 - bundle.price / bundle.originalPrice) * 100)}%
                            </span>
                            <span className="text-xs text-gray-500">
                              ${(bundle.originalPrice - bundle.price).toFixed(2)} OFF
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <AddToCartButton 
                        item={{
                          ...bundle,
                          image: bundle.images?.[0]?.url || bundle.image || bundle.thumbnail || getPlaceholderImage(bundle.type),
                          id: bundle._id || bundle.id,
                          name: bundle.title || bundle.name,
                          price: bundle.price
                        }}
                        type="bundle"
                        className="px-5 py-2.5 cursor-pointer bg-gradient-to-r from-primary to-gray-900 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center min-w-[120px] flex-shrink-0"
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
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Bundles Available
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-8">
              We're currently curating amazing value bundles for you. 
              Check back soon for incredible savings on premium digital assets!
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  getBundles();
                  getMasterBundles();
                }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-gray-900 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Bundles
              </button>
              <Link
                to="/services"
                className="px-8 py-3 bg-white border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
            </div>
          </div>
        )}

      
      </div>
    </div>
  );
};

export default Bundles;