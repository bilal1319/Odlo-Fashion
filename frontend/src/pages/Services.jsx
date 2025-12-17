import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import useProductsStore from '../store/productsSrtore';

const Services = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("luxury-logo-collections");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Get products from store
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

  // Function to extract category from hash
  const getCategoryFromHash = (hash) => {
    if (!hash) return "luxury-logo-collections";
    const categoryHash = hash.replace('#', '');
    return categoryHash;
  };

  // Function to get category title
  const getCategoryTitle = (cat) => {
    const titles = {
      "luxury-logo-collections": "LUXURY LOGO COLLECTIONS",
      "branding-identity-packs": "BRANDING & IDENTITY PACKS",
      "social-media-kits": "SOCIAL MEDIA KITS",
      "posters-prints": "POSTERS & PRINTS",
      "mockups": "MOCKUPS",
      "3d-fashion-assets": "3D FASHION ASSETS"
    };
    return titles[cat] || "Premium Services";
  };

  // Fetch products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        await getAllProducts();
        setIsInitialLoad(false);
      } catch (error) {
        console.error("Failed to load products:", error);
        setIsInitialLoad(false);
      }
    };
    loadProducts();
  }, [getAllProducts]);

  // Filter products based on selected category
  useEffect(() => {
    const categoryHash = getCategoryFromHash(location.hash);
    setSelectedCategory(categoryHash);
    
    if (Array.isArray(products) && products.length > 0) {
      // Convert URL hash to backend categoryId
      const backendCategoryId = categoryMapping[categoryHash];
      
      // Filter products by categoryId from backend
      if (backendCategoryId) {
        const filtered = products.filter(product => {
          return product.categoryId === backendCategoryId;
        });
        setFilteredProducts(filtered);
      } else {
        // Default to all products if no category found
        setFilteredProducts(products);
      }
    } else {
      setFilteredProducts([]);
    }
    
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  }, [location.hash, products]);

  // Get placeholder image based on category
  const getPlaceholderImage = (categoryId) => {
    const placeholders = {
      "luxury_logo_collections": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80",
      "branding_identity_packs": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop&q=80",
      "social_media_kits": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&q=80",
      "posters_prints": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop&q=80",
      "3d_fashion_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=400&h=300&fit=crop&q=80"
    };
    return placeholders[categoryId] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
  };

  if (isProductsLoading || isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            {getCategoryTitle(selectedCategory)}
          </h1>
          <p className="text-lg text-light-dark">
            High-End Digital Assets for Fashion, Branding & Creative Studios
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredProducts.length} products in this category
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
              >
                <Link to={`/service/${product.slug}`}>
                  <div className="h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={product.image || product.thumbnail || getPlaceholderImage(product.categoryId)} 
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPlaceholderImage(product.categoryId);
                      }}
                    />
                  </div>
                </Link>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-3 leading-tight text-dark line-clamp-2 min-h-[3.5rem]">
                    {product.title}
                  </h3>
                  
                  <p className="text-sm mb-4 leading-relaxed text-light-dark line-clamp-3 flex-grow">
                    {product.description || product.shortDescription || "Premium digital asset for your branding needs."}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-center">
                        {/* Display actual price from backend without formatting */}
                        <p className="text-3xl font-bold text-dark tracking-tight">
                          ${product.price}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </p>
                        )}
                      </div>
                      
                      <AddToCartButton 
                        item={{
                          ...product,
                          id: product._id,
                          name: product.title,
                          price: product.price
                        }}
                        type="product"
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
            <p className="text-lg text-gray-500">No products found for this category.</p>
            
            <div className="mt-4 space-y-4">
              {!Array.isArray(products) || products.length === 0 ? (
                <>
                  <button 
                    onClick={() => getAllProducts()}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-gray-900 transition-colors"
                  >
                    Load Products
                  </button>
                  <p className="text-sm text-gray-400 mt-2">
                    No products loaded. Click above to fetch products.
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  Please select a different category from the navigation menu.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;