import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton';
import useProductsStore from '../store/productsSrtore';

const ServicesDetails = () => {
  const { slug } = useParams(); // Changed from id to slug
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  
  // Get product by slug from store
  const { 
    getProductBySlug, 
    clearProduct,
    getProductsByCategoryId,
    products 
  } = useProductsStore();

  // Fetch product data on component mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await getProductBySlug(slug);
        console.log("Fetched product:", fetchedProduct);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }

    // Clean up when component unmounts
    return () => {
      clearProduct();
    };
  }, [slug, getProductBySlug, clearProduct]);

  // Get product from store
  useEffect(() => {
    const fetchProductFromStore = () => {
      // Try to find product in store products
      const foundProduct = products.find(p => p.slug === slug);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    };

    fetchProductFromStore();
  }, [slug, products]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };

  // If loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            to="/services" 
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Get placeholder image based on category
  const getPlaceholderImage = (categoryId) => {
    const placeholders = {
      "luxury_logo_collections": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&q=80",
      "branding_identity_packs": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop&q=80",
      "social_media_kits": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&q=80",
      "posters_prints": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&q=80",
      "3d_fashion_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=800&h=600&fit=crop&q=80"
    };
    return placeholders[product.categoryId] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&q=80";
  };
  
  // Create an array item with quantity for AddToCartButton
  const cartItem = {
    ...product,
    id: product._id, // Use _id from backend
    image: product.images?.[0]?.url || product.image || product.thumbnail || getPlaceholderImage(product.categoryId),
    name: product.title,
    quantity: quantity
  };

  

  return (
    <div className="min-h-screen py-8 md:py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center cursor-pointer text-primary hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Services
        </button>
        
        {/* Main Product Section */}
        <div className="rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image || product.thumbnail || getPlaceholderImage(product.categoryId)}
                  alt={product.title}
                  className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getPlaceholderImage(product.categoryId);
                  }}
                />
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                
                {/* Price */}
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-serif font-bold text-green-800">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description || product.shortDescription || "Premium digital asset for your branding needs."}
                </p>
              </div>
              
              {/* Features */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h2>
                <ul className="space-y-2 text-gray-700">
                  {/* Render features from backend if available, otherwise show defaults */}
                  {product.features && product.features.length > 0 ? (
                    product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        High-resolution files (300 DPI)
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Fully editable vector files
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Commercial license included
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lifetime updates
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        24/7 Support
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {/* Additional Info */}
              {(product.tags || product.categoryId) && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {product.categoryId && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {product.categoryId.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    )}
                    {product.tags && product.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity and Add to Cart */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Quantity Selector */}
                  {/* <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-gray-700 font-medium">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div> */}
                  
                  {/* Use AddToCartButton component for consistency */}
                  <AddToCartButton 
                    item={cartItem}
                    type="product"
                    className="flex-1  px-8 py-3 font-bold rounded-md transition-all duration-300 bg-white text-primary hover:bg-gray-900 hover:text-white hover:scale-105 active:scale-95 border border-gray-300"
                    quantity={quantity}
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

export default ServicesDetails;