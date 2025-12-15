import React from 'react';

// Bundle data with minimal details
const bundlesData = [
  {
    id: 1,
    title: "Full Branding Studio Bundle",
    price: "$800",
    description: "The complete luxury identity system - everything you need to build elite visual identities with breathtaking polish.",
    useCase: "designers with high-end clients, boutique owners, fashion startups, creative directors",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Poster Mega Pack",
    price: "$800",
    description: "Museum-grade collection of printable fashion art for luxury studios, photographers, and creative spaces.",
    useCase: "interior designers, stylists, content creators, boutique owners, photographers",
    image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "3D Accessories Collection",
    price: "$800",
    description: "Next-generation digital asset bundle with meticulously sculpted wearables for fashion ads and AR/VR experiences.",
    useCase: "CGI fashion designers, e-commerce brands, visual effects studios, AR/VR developers",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Social Media Master Bundle",
    price: "$800",
    description: "Complete fashion content engine for building a premium digital presence across all social platforms.",
    useCase: "fashion startups, agencies, influencers, boutique brands, content creators",
    image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    title: "The Luxury Mockup Collection",
    price: "$800",
    description: "Ultra-premium photorealistic mockups for fashion, cosmetics, and luxury product presentations.",
    useCase: "branding agencies, portfolio designers, fashion startups, e-commerce brands",
    image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop"
  }
];

const Bundles = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Add custom colors */}
      <style jsx>{`
        @layer utilities {
          .text-primary { color: #111111; }
          .text-dark { color: #111111; }
          .text-light-dark { color: #3f3f3f; }
          .text-light { color: #FFFFFF; }
          .bg-primary { background-color: #111111; }
          .bg-secondary { background-color: #FFFFFF; }
        }
      `}</style>

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
                      className="w-full px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 bg-primary text-light hover:bg-gray-900 hover:scale-105 active:scale-95 shadow-md"
                    >
                      VIEW DETAILS
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