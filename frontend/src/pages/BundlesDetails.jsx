import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import useProductsStore from '../store/productsSrtore';

const BundleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [bundle, setBundle] = useState(null);
  
  // Get bundle by slug from store
  const { 
    getBundleBySlug, 
    clearBundle,
    bundles,
    masterBundles
  } = useProductsStore();

  // Fetch bundle data on component mount
  useEffect(() => {
    const loadBundle = async () => {
      try {
        setIsLoading(true);
        await getBundleBySlug(slug);
      } catch (error) {
        console.error("Failed to load bundle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadBundle();
    }

    return () => {
      clearBundle();
    };
  }, [slug, getBundleBySlug, clearBundle]);

  // Find bundle in store
  useEffect(() => {
    const findBundle = () => {
      let foundBundle = null;
      
      // Check regular bundles (safely)
      if (Array.isArray(bundles)) {
        foundBundle = bundles.find(b => b.slug === slug);
      }
      
      // If not found, check master bundles (safely)
      if (!foundBundle && Array.isArray(masterBundles)) {
        foundBundle = masterBundles.find(b => b.slug === slug);
      }
      
      if (foundBundle) {
        setBundle(foundBundle);
      }
    };

    findBundle();
  }, [slug, bundles, masterBundles]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  // Get included products for the bundle
  const getIncludedProducts = (bundleData) => {
    if (bundleData?.includedProducts && Array.isArray(bundleData.includedProducts)) {
      return bundleData.includedProducts;
    }
    
    if (bundleData?.includedItems && Array.isArray(bundleData.includedItems)) {
      return bundleData.includedItems;
    }
    
    // Default fallback products
    return [
      "Premium Design Assets",
      "High-Quality Templates", 
      "Commercial License",
      "Lifetime Updates",
      "24/7 Support"
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading bundle details...</p>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Bundle Not Found</h1>
          <p className="text-gray-600 mb-6">The bundle you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/bundles')}
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors"
          >
            Back to Bundles
          </button>
        </div>
      </div>
    );
  }

  const cartItem = {
    ...bundle,
    id: bundle._id || bundle.id,
    name: bundle.title || bundle.name,
    quantity: quantity
  };

  const getPlaceholderImage = (bundleType) => {
    const placeholders = {
      "full_branding": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&q=80",
      "poster_pack": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop&q=80",
      "3d_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=800&h=600&fit=crop&q=80",
      "social_media": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&q=80",
      "ultimate": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop&q=80"
    };
    return placeholders[bundle.type] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&q=80";
  };

  const includedProducts = getIncludedProducts(bundle);
  const savingsPercentage = bundle.savingsPercentage || "67%";
  const originalPrice = bundle.originalPrice ? `$${bundle.originalPrice}` : "$2400";

  return (
    <div className="min-h-screen py-8 md:py-12 bg-linear-to-b from-gray-50 to-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center cursor-pointer text-primary hover:text-gray-900 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Bundles
        </button>
        
        {/* Main Bundle Section */}
        <div className="rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8 lg:p-12">
            {/* Bundle Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={bundle.image || bundle.thumbnail || getPlaceholderImage(bundle.type)}
                  alt={bundle.title || bundle.name}
                  className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getPlaceholderImage(bundle.type);
                  }}
                />
              </div>
              
              {/* Bundle Highlights */}
              <div className="bg-linear-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bundle Highlights
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Limited time offer
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Exclusive bundle content
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    Commercial license included
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Bundle Details Section */}
            <div className="space-y-6">
              {/* Bundle Header */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                  {bundle.title || bundle.name}
                </h1>
                
                {/* Price and Savings */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                      ${bundle.price}
                    </span>
                    {bundle.originalPrice && (
                      <span className="text-lg text-gray-500 ml-2 line-through">
                        ${bundle.originalPrice}
                      </span>
                    )}
                  </div>
                  {bundle.originalPrice && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-linear-to-r from-green-500 to-emerald-500 text-white">
                      Save {savingsPercentage}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Bundle Description */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Bundle Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  {bundle.description || bundle.longDescription || "Complete bundle of premium digital assets for your branding needs."}
                </p>
              </div>
              
              {/* Included Products */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  What's Included ({includedProducts.length} Premium Products)
                </h2>
                <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                  <ul className="space-y-2">
                    {includedProducts.map((product, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <svg className="w-4 h-4 text-purple-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{product}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Use Case */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Perfect For
                </h2>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {bundle.useCase || bundle.targetAudience || "Brands, designers, and creators looking for a complete design system to elevate their visual identity."}
                </p>
              </div>
              
              {/* Bundle Features */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bundle Benefits
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-center bg-green-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Save {savingsPercentage} vs buying separately</span>
                  </li>
                  <li className="flex items-center bg-green-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Cohesive design system</span>
                  </li>
                  <li className="flex items-center bg-green-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Unlimited commercial projects</span>
                  </li>
                  <li className="flex items-center bg-green-50 p-3 rounded-lg">
                    <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
              </div>
              
              {/* Quantity and Action Buttons */}
              <div className="pt-6 flex flex-wrap items-center gap-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-gray-700 font-medium">
                      Quantity:
                    </label>
                    <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none text-lg font-medium"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="gap-4">
                  {/* Add to Cart Button */}
                  <AddToCartButton 
                    item={cartItem}
                    type="bundle"
                    className="bg-primary text-white px-8 py-3 rounded-md hover:bg-gray-900 transition-colors duration-300 text-lg font-medium flex items-center justify-center group"
                    quantity={quantity}
                    showIcon={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleDetail;