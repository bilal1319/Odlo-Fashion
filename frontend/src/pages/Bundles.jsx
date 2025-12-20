import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import useProductsStore from '../store/productsSrtore';
import { getIO } from '../utils/socketClient';

const Bundles = () => {
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Get placeholder image for bundle
  const getPlaceholderImage = (bundleType) => {
    const placeholders = {
      "full_branding": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80",
      "poster_pack": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop&q=80",
      "3d_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=400&h=300&fit=crop&q=80",
      "social_media": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop&q=80",
      "ultimate": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop&q=80"
    };
    return placeholders[bundleType] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
  };

  if (isLoading || isBundlesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading bundles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            BUNDLES
          </h1>
          <p className="text-lg text-light-dark max-w-3xl ">
            Complete brand-building systems engineered for creators who want to elevate every touchpoint with editorial sophistication and timeless luxury.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {allBundles.length} bundles
          </p>
        </div>

        {allBundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allBundles.map((bundle) => (
              <div 
                key={bundle._id || bundle.id} 
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1"
              >
                <Link to={`/bundle/${bundle.slug}`}>
                  <div className="h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={bundle.image || bundle.thumbnail || getPlaceholderImage(bundle.type)} 
                      alt={bundle.title || bundle.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPlaceholderImage(bundle.type);
                      }}
                    />
                  </div>
                </Link>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-3 leading-tight text-dark line-clamp-2 min-h-[3.5rem]">
                    {bundle.title || bundle.name}
                  </h3>
                  
                  <p className="text-sm mb-6 leading-relaxed text-light-dark flex-grow line-clamp-3">
                    {bundle.description || bundle.shortDescription || "Complete bundle of premium digital assets for your branding needs."}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-center">
                        <p className="text-xl font-bold text-green-800 tracking-tight ">
                          ${bundle.price}
                        </p>
                        {bundle.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ${bundle.originalPrice}
                          </p>
                        )}
                      </div>
                      
                      {/* AddToCartButton for bundles */}
                      <AddToCartButton 
                        item={{
                          ...bundle,
                          image: bundle.images?.[0]?.url || bundle.image || bundle.thumbnail || getPlaceholderImage(bundle.type),
                          id: bundle._id || bundle.id,
                          name: bundle.title || bundle.name,
                          price: bundle.price
                        }}
                        type="bundle"
                        className="w-full px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 bg-primary text-white hover:bg-gray-900 hover:scale-105 active:scale-95 shadow-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No bundles found.</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                Bundles type: {typeof bundles}
              </p>
              <p className="text-sm text-gray-600">
                Master bundles type: {typeof masterBundles}
              </p>
              <button 
                onClick={() => {
                  getBundles();
                  getMasterBundles();
                }}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-gray-900 transition-colors"
              >
                Refresh Bundles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bundles;