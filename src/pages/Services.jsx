import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Dummy data with image placeholders
const servicesData = {
  "luxury-logo-collections": [
    { id: 1, title: "Couture Serif Logo Pack", price: "$300", description: "A curated collection of high-fashion serif logos inspired by Parisian couture houses.", useCase: "fashion brands, perfume labels, boutique identities", image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop" },
    { id: 2, title: "Modern Editorial Logo Set", price: "$300", description: "A set of clean, magazine-ready logotypes with bold typography and minimal geometry.", useCase: "modern fashion startups, luxury e-commerce, creative studios", image: "https://images.unsplash.com/photo-1634942536828-43c8f964db34?w=400&h=300&fit=crop" },
    { id: 3, title: "Signature Brush Script Logos", price: "$300", description: "Hand-drawn signatures refined into vector perfection.", useCase: "personal brands, beauty lines, social creators", image: "https://images.unsplash.com/photo-1634942536748-57a5c6ee3b5c?w=400&h=300&fit=crop" },
    { id: 4, title: "Monogram Heritage Collection", price: "$300", description: "50 monograms inspired by the letterform systems of iconic luxury maisons.", useCase: "jewelry, accessories, packaging, upscale boutiques", image: "https://images.unsplash.com/photo-1634942536817-4291b3a5c8b7?w=400&h=300&fit=crop" },
    { id: 5, title: "Minimal Line Logos", price: "$300", description: "A minimalist pack built around thin-line geometry, fashion symmetry, and modern elegance.", useCase: "skincare brands, online boutiques, interior studios", image: "https://images.unsplash.com/photo-1634942536807-423b1e5c8b5d?w=400&h=300&fit=crop" },
    { id: 6, title: "Gold Foil Brand Mark Set", price: "$300", description: "Logos specifically engineered for metallic foil, embossing, and premium print applications.", useCase: "packaging, product boxes, luxury business cards", image: "https://images.unsplash.com/photo-1634942536797-5b3c1e8b5d5f?w=400&h=300&fit=crop" },
    { id: 7, title: "Boutique Shop Logo Kit", price: "$300", description: "A tailored logo collection designed for concept stores, ateliers, and boutique studios.", useCase: "retail branding, signage, product labels", image: "https://images.unsplash.com/photo-1634942536769-4b3c1e8b5d5e?w=400&h=300&fit=crop" },
    { id: 8, title: "Perfume & Fragrance Logo Pack", price: "$300", description: "Elegant perfume-centric typography crafted to match high-end fragrance brands.", useCase: "perfume boxes, ads, bottle labels", image: "https://images.unsplash.com/photo-1634942536751-6b3c1e8b5d5d?w=400&h=300&fit=crop" },
    { id: 9, title: "Fashion Tech Sans Logos", price: "$300", description: "Minimalist sans-serif logos inspired by futuristic fashion and luxury techwear.", useCase: "activewear, luxury streetwear, digital fashion", image: "https://images.unsplash.com/photo-1634942536741-7b3c1e8b5d5c?w=400&h=300&fit=crop" },
    { id: 10, title: "Couture Crest Logo Collection", price: "$300", description: "Royal-style crests, emblems, and insignias designed with classic fashion house inspiration.", useCase: "packaging, accessories, jewelry brands", image: "https://images.unsplash.com/photo-1634942536731-8b3c1e8b5d5b?w=400&h=300&fit=crop" },
  ],
  "branding-identity-packs": [
    { id: 11, title: "Editorial Branding Starter Kit", price: "$300", description: "A foundational brand kit including typography, color palettes, layout grids, and mini guidelines.", useCase: "new brands building identity", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 12, title: "Luxury Color Palette Library", price: "$300", description: "40 curated color systems inspired by high fashion.", useCase: "branding, packaging, content design", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
    { id: 13, title: "Minimal Brand Guidelines Template", price: "$300", description: "A clean, structured brand manual with pages for identity rules, typography, layouts, and photography tone.", useCase: "agencies, designers, fashion brands", image: "https://images.unsplash.com/photo-1558618663-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 14, title: "Boutique Brand Starter Pack", price: "$300", description: "Logos + colors + simple templates for boutique startups.", useCase: "small fashion stores, salons, home studios", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
    { id: 15, title: "Aesthetic Typography Pairings Set", price: "$300", description: "Editorial serif ↔ modern sans serif pairings tuned for fashion UI/UX + print.", useCase: "branding, magazine layouts", image: "https://images.unsplash.com/photo-1558618663-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 16, title: "High-Fashion Photography Direction Guide", price: "$300", description: "A creative direction system describing lighting, poses, moods, and color grading for fashion brands.", useCase: "photoshoots, campaigns", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
    { id: 17, title: "Luxury Packaging Starter Templates", price: "$300", description: "Box layouts, perfume bottle labels, shopping bag templates, tag designs.", useCase: "products, merch packaging", image: "https://images.unsplash.com/photo-1558618663-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 18, title: "Editorial Layout Grid System", price: "$300", description: "Professional grid frameworks used by fashion magazines for posters, covers, and lookbooks.", useCase: "designers working in print/digital", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
    { id: 19, title: "Fashion Brand Tone of Voice Guide", price: "$300", description: "Writing style frameworks for luxury and boutique brands.", useCase: "copywriters, brand founders", image: "https://images.unsplash.com/photo-1558618663-fcd25c85cd64?w=400&h=300&fit=crop" },
    { id: 20, title: "Brand Photography LUT Pack", price: "$300", description: "A set of cinematic, soft-fashion color grading LUTs tailored for fashion campaigns.", useCase: "photo editing, campaign visuals", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" },
  ],
  "social-media-kits": [
    { id: 21, title: "Editorial Instagram Grid System", price: "$300", description: "A 9-grid + 12-grid + 30-day editorial Instagram design system.", useCase: "fashion pages, personal brands", image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop" },
    { id: 22, title: "High-End Instagram Story Templates", price: "$300", description: "Cinematic, magazine-style story layouts with elegant typography.", useCase: "drops, launches, lifestyle content", image: "https://images.unsplash.com/photo-1611262588019-d12430b98920?w=400&h=300&fit=crop" },
    { id: 23, title: "Fashion Ad Creative Templates", price: "$300", description: "Ad-ready layouts optimized for engagement, conversion, and visual luxury.", useCase: "paid ads, brand promotions", image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop" },
    { id: 24, title: "Fashion Lookbook Template Kit", price: "$300", description: "30+ editorial spreads inspired by Vogue, Harper's Bazaar, W Magazine.", useCase: "campaigns, collections", image: "https://images.unsplash.com/photo-1611262588019-d12430b98920?w=400&h=300&fit=crop" },
    { id: 25, title: "Influencer Collab Media Kit Template", price: "$300", description: "A professional media kit system for influencers partnering with brands.", useCase: "brand ambassadors, stylists", image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop" },
    { id: 26, title: "Carousel Storytelling Pack", price: "$300", description: "Narrative-driven carousel templates with aesthetic cropping and typography.", useCase: "trends, tutorials, editorials", image: "https://images.unsplash.com/photo-1611262588019-d12430b98920?w=400&h=300&fit=crop" },
    { id: 27, title: "Canva Luxury Template Pack", price: "$300", description: "Designer-level Canva layouts styled for fashion brands.", useCase: "brands without Photoshop skills", image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop" },
    { id: 28, title: "Social Campaign Launch Kit", price: "$300", description: "A complete visual package for launching a product or collection.", useCase: "new releases, drop announcements", image: "https://images.unsplash.com/photo-1611262588019-d12430b98920?w=400&h=300&fit=crop" },
    { id: 29, title: "High Fashion Quote Templates", price: "$300", description: "Minimalist, elegant quote panels designed for aesthetic content.", useCase: "lifestyle pages, fashion influencers", image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop" },
    { id: 30, title: "UGC Fashion Story Templates", price: "$300", description: "User-generated content layouts styled for premium aesthetic.", useCase: "influencer content, product reviews", image: "https://images.unsplash.com/photo-1611262588019-d12430b98920?w=400&h=300&fit=crop" },
  ],
  "posters-prints": [
    { id: 31, title: "Vogue-Inspired Editorial Posters", price: "$300", description: "Magazine-style posters with bold fashion photography and editorial grids.", useCase: "studio decor, galleries", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 32, title: "Minimal Line Art Posters", price: "$300", description: "Abstract feminine silhouettes and couture-inspired poses.", useCase: "wall decor, boutique interiors", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 33, title: "Aesthetic Model Sketch Pack", price: "$300", description: "Hand-sketched runway fashion models, digitized for print.", useCase: "designers, studios", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 34, title: "Black & White Fashion Posters", price: "$300", description: "Monochrome portraits with sharp contrast and timeless appeal.", useCase: "home decor, showrooms", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 35, title: "Runway Motion Poster Series", price: "$300", description: "Dynamic poster designs capturing runway energy and lighting.", useCase: "studio displays, branding", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 36, title: "Luxury Fashion Photography Prints", price: "$300", description: "High-end editorial shots with cinematic composition.", useCase: "magazines, walls, book covers", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 37, title: "Magazine Cover Template Pack", price: "$300", description: "Editable fashion cover layouts styled after global magazines.", useCase: "editorial projects, mockups", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 38, title: "Abstract Fashion Silhouette Art", price: "$300", description: "Minimal abstraction of fashion forms and motion.", useCase: "decor, galleries", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 39, title: "High-Fashion Collage Posters", price: "$300", description: "Mixed media posters combining typography, collage elements, and editorial photography.", useCase: "concept stores, cafes", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
    { id: 40, title: "Luxury Wall Decor Panels", price: "$300", description: "Coordinated sets of poster panels designed as interior art series.", useCase: "boutiques, studios", image: "https://images.unsplash.com/photo-1578675375658-d3981e0e06e0?w=400&h=300&fit=crop" },
  ],
  "mockups": [
    { id: 41, title: "Perfume Bottle Mockup Set", price: "$300", description: "Photorealistic glass refraction, metallic caps, and cinematic lighting.", useCase: "fragrance branding", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 42, title: "Luxury Shopping Bag Mockups", price: "$300", description: "Soft shadows, textured paper, and realistic handles.", useCase: "boutique packaging", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 43, title: "Product Box & Packaging Mockups", price: "$300", description: "High-resolution packaging scenes for cosmetics, shoes, and perfume.", useCase: "e-commerce, ads", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 44, title: "Apparel Tag Mockups", price: "$300", description: "Elegant tag scenes with shadow depth and stitched realism.", useCase: "clothing brands", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 45, title: "Magazine Editorial Mockup Set", price: "$300", description: "Double spreads, cover views, and flat lays with accurate page curve simulation.", useCase: "editorial design", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 46, title: "Cosmetic Tube & Bottle Mockups", price: "$300", description: "Studio-lit scenes with soft reflections and clean surfaces.", useCase: "skincare brands", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 47, title: "Shoe Box Mockup Pack", price: "$300", description: "Minimalist packaging design scenes for premium footwear.", useCase: "shoe brands, product launches", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 48, title: "Business Card Mockups", price: "$300", description: "Embossed, foil, and textured surfaces with realistic lighting.", useCase: "corporate branding", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 49, title: "Billboard & Poster Mockup Kit", price: "$300", description: "Outdoor advertising mockups with real urban textures.", useCase: "fashion ads, campaigns", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
    { id: 50, title: "Fabric & Clothing Label Mockups", price: "$300", description: "Close-up fabric texture realism with stitched details.", useCase: "apparel brands", image: "https://images.unsplash.com/photo-1590736969956-6d9e2e5870b3?w=400&h=300&fit=crop" },
  ],
  "3d-fashion-assets": [
    { id: 51, title: "3D Luxury Handbag Model", price: "$300", description: "High-poly detailing with leather texture simulation.", useCase: "product renders, AR", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 52, title: "3D Sunglasses Set", price: "$300", description: "Designer eyewear models with reflective lens shaders.", useCase: "ads, 3D fashion", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 53, title: "3D Necklace & Jewelry Pack", price: "$300", description: "Gemstone refraction, metal shaders, and perfect topology.", useCase: "jewelry ads", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 54, title: "3D Watch Model", price: "$300", description: "Dynamic reflections, polished metal, and crystal clear glass realism.", useCase: "product showcases", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 55, title: "3D Sneaker Model", price: "$300", description: "High-poly sneaker with cloth simulation + realistic stitching.", useCase: "footwear ads", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 56, title: "3D Heels Collection", price: "$300", description: "Luxury heels modeled for ads, catalogs, and 3D fashion shows.", useCase: "campaigns, e-commerce", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 57, title: "3D Hat & Fashion Accessories Set", price: "$300", description: "Caps, fedoras, and runway-inspired headwear with fabric detail.", useCase: "fashion design", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 58, title: "3D Earrings & Rings Pack", price: "$300", description: "A jewelry accessory set with gemstone renders and metallic shine.", useCase: "product renders", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 59, title: "3D Belt & Buckle Designs", price: "$300", description: "Fashion belt models with metallic detailing and luxury stitching.", useCase: "catalogs, ads", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
    { id: 60, title: "AR-Ready Wearable Fashion Pack", price: "$300", description: "Optimized low-poly + high-quality texture assets for AR try-ons and digital fashion shows.", useCase: "AR apps, metaverse wearables", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop" },
  ]
};

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
  {/* Add custom colors to Tailwind */}
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
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full"
        >
          {/* Product Image */}
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
          
          {/* Card Content */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Service Title */}
            <h3 className="text-xl font-semibold mb-3 leading-tight text-dark line-clamp-2 min-h-[3.5rem]">
              {service.title}
            </h3>
            
            {/* Service Description */}
            <p className="text-sm mb-4 leading-relaxed text-light-dark line-clamp-3 flex-grow">
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
                  <p className="text-3xl font-bold text-dark tracking-tight">
                    {service.price}
                  </p>
                </div>
                
                {/* Button with better styling */}
                <Link to={`/services/${service.id}`} className="w-full">
                <button 
                  className="w-full px-6 py-3 text-sm font-medium rounded-md transition-all duration-300 bg-primary text-light hover:bg-gray-900 hover:scale-105 active:scale-95 shadow-md"
                >
                  VIEW DETAILS
                </button>
                </Link>
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