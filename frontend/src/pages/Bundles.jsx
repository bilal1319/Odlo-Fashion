import React from 'react';
import { bundlesData } from '../data/bundlesData';
import { Link } from 'react-router-dom';

const Bundles = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
     
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            BUNDLES
          </h1>
          <p className="text-lg text-light-dark max-w-3xl mx-auto">
            Complete brand-building systems engineered for creators who want to elevate every touchpoint with editorial sophistication and timeless luxury.
          </p>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bundlesData.map((bundle) => (
            <div 
              key={bundle.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              {/* Bundle Image - Fixed height container */}

              <Link to={`/bundles/${bundle.id}`}>
              <div className="h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={bundle.image} 
                  alt={bundle.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
                  }}
                />
              </div>
              </Link>
              {/* Card Content - Flex-grow to fill space */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Bundle Title */}
                <h3 className="text-xl font-semibold mb-3 leading-tight text-dark line-clamp-2">
                  {bundle.title}
                </h3>
                
                {/* Bundle Description */}
                <p className="text-sm mb-6 leading-relaxed text-light-dark flex-grow line-clamp-3">
                  {bundle.description}
                </p>
                
                {/* Use Case - Commented out for now */}
                {/* <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-wider mb-1 text-light-dark">
                    Perfect For
                  </p>
                  <p className="text-sm text-light-dark">
                    {bundle.useCase}
                  </p>
                </div> */}
                
                {/* Price and Button - Column layout at bottom */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Price with better styling */}
                    <div className="text-center">
                      <p className="text-3xl font-bold text-dark tracking-tight">
                        {bundle.price}
                      </p>
                      <p className="text-xs text-light-dark mt-1 uppercase tracking-wider">
                        Starting Price
                      </p>
                    </div>
                    
                    {/* Button with better styling */}
                    <button 
                      className="w-full px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 bg-primary text-light-text hover:bg-gray-900 hover:scale-105 active:scale-95 shadow-md"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default Bundles;