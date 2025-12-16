import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import AddToCartButton from '../components/AddToCartButton';

const Services = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("luxury-logo-collections");
  const [filteredServices, setFilteredServices] = useState([]);

  // Function to extract category from hash
  const getCategoryFromHash = (hash) => {
    if (!hash) return "luxury-logo-collections";
    
    // Remove the # and return the hash value
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

  // Filter services based on category
  useEffect(() => {
    const category = getCategoryFromHash(location.hash);
    setSelectedCategory(category);
    
    // Filter services to show only the selected category
    if (servicesData[category]) {
      setFilteredServices(servicesData[category]);
    } else {
      // Default to luxury-logo-collections if category not found
      setFilteredServices(servicesData["luxury-logo-collections"]);
    }
    
    // Scroll to top when category changes
    window.scrollTo(0, 0);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Category Header - Only shows the selected category */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-primary">
            {getCategoryTitle(selectedCategory)}
          </h1>
          <p className="text-lg text-light-dark">
            High-End Digital Assets for Fashion, Branding & Creative Studios
          </p>
        </div>

        {/* Services Grid - Shows ONLY the selected category */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No services found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;