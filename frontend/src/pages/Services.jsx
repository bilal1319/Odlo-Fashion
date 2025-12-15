import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import AddToCartButton from '../components/AddToCartButton';

const Services = ({ category = "luxury-logo-collections" }) => {
  const [selectedServices, setSelectedServices] = useState(servicesData[category] || servicesData["luxury-logo-collections"]);

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
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-lg text-light-dark">
            High-End Digital Assets for Fashion, Branding & Creative Studios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedServices.map((service) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
            >
              <Link to={`/services/${service.id}`}>
                <div className="h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
                    }}
                  />
                </div>
              </Link>
              
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold mb-3 leading-tight text-dark line-clamp-2 min-h-[3.5rem]">
                  {service.title}
                </h3>
                
                <p className="text-sm mb-4 leading-relaxed text-light-dark line-clamp-3 flex-grow">
                  {service.description}
                </p>
                
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-dark tracking-tight">
                        {service.price}
                      </p>
                    </div>
                    
                    {/* Use AddToCartButton component here */}
                    <AddToCartButton 
                      item={service}
                      type="service"
                      className="w-full px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 bg-primary text-light-text hover:bg-gray-900 hover:scale-105 active:scale-95 shadow-md"
                    />
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

export default Services;