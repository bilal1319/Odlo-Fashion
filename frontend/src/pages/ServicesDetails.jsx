// src/components/ProductDetails.js
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import Services from './Services';

const ServicesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // Flatten all services data into a single array
  const allServices = Object.values(servicesData).flat();
  
  // Find the product by ID
  const product = allServices.find(service => service.id === parseInt(id));
  
  // Find the category this product belongs to
  const findProductCategory = () => {
    for (const [category, products] of Object.entries(servicesData)) {
      if (products.some(p => p.id === parseInt(id))) {
        return category;
      }
    }
    return "luxury-logo-collections";
  };
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    // In a real app, you would dispatch to Redux or use context
    alert(`Added ${quantity} x ${product.title} to cart!`);
    // You can add cart logic here
  };
  
  // If product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
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
  
  const category = findProductCategory();
  
  return (
    <div className="min-h-screen py-8 md:py-12">
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
        <div className="rounded-lg  overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&h=600&fit=crop&q=80";
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
                  <span className="text-4xl font-bold text-gray-900">
                    {product.price}
                  </span>
                  
                </div>
              
              </div>
              
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              {/* Use Case */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Perfect For</h2>
                <p className="text-gray-700">
                  {product.useCase}
                </p>
              </div>
              
              {/* Features */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h2>
                <ul className="space-y-2 text-gray-700">
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
                </ul>
              </div>
              
              {/* Quantity and Add to Cart */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
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
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-white text-primary px-8 py-3 rounded-sm border border-primary hover:bg-gray-900 hover:text-light-text transition-colors duration-300 text-lg font-medium flex items-center justify-center group"
                  >
                    <svg 
                      className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    ADD TO CART - {product.price}
                  </button>
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