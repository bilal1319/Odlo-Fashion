import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';

// Component
const Services = ({ category = "luxury-logo-collections" }) => {
  const [selectedServices, setSelectedServices] = useState(servicesData[category] || servicesData["luxury-logo-collections"]);

  // Get category title for display
  const getCategoryTitle = (cat) => {
    const titles = {
      "luxury-logo-collections": "Luxury Logo Collections",
      "branding-identity-packs": "Branding & Identity Packs",
      "social-media-kits": "Social Media Kits",
      "posters-prints": "Posters & Prints",
      "mockups": "Mockups",
      "3d-fashion-assets": "3D Fashion Assets"
    };
    return titles[cat] || "Premium Services";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
  

  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-8 md:mb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
        {getCategoryTitle(category)}
      </h1>
      <p className="text-lg text-light-dark">
        High-End Digital Assets for Fashion, Branding & Creative Studios
      </p>
    </div>

    {/* Services Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {selectedServices.map((service) => (
        <div 
          key={service.id} 
          className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1" // Added group class
        >
        <Link to={`/services/${service.id}`} >
          {/* Product Image */}
          <div className="h-48 w-full overflow-hidden bg-gray-100 shrink-0">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" // Changed hover to group-hover
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
              }}
            />
          </div>
          </Link>
          
          {/* Card Content */}
          <div className="p-5 flex flex-col grow">
            {/* Service Title */}
            <h3 className="text-xl font-semibold mb-3 leading-tight text-dark line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            
            {/* Service Description */}
            <p className="text-sm mb-4 leading-relaxed text-light-dark line-clamp-3 grow group-hover:text-gray-900 transition-colors">
              {service.description}
            </p>
            
            {/* Use Case */}
            {/* <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wider mb-1 text-light-dark">
                Use Cases
              </p>
              <p className="text-sm text-light-dark line-clamp-2">
                {service.useCase}
              </p>
            </div> */}
            
            {/* Price and Button - Fixed at bottom */}
            <div className="pt-4 border-t border-gray-100 mt-auto">
              <div className="flex flex-col items-center space-y-4">
                {/* Price with better styling */}
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark tracking-tight group-hover:text-primary transition-colors">
                    {service.price}
                  </p>
                </div>
                
                {/* Button with better styling */}
                <button 
                  className="w-full px-6 py-3 text-sm font-medium rounded-sm transition-all duration-300 bg-white text-primary border border-primary group-hover:bg-primary group-hover:text-white group-hover:scale-105 group-hover:-translate-y-0.5 active:scale-95 shadow-md"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
    
    {/* Empty State */}
    {selectedServices.length === 0 && (
      <div className="text-center py-16">
        <p className="text-lg text-light-dark">
          No services found for this category.
        </p>
      </div>
    )}
  </div>
</div>
  );
};

export default Services;