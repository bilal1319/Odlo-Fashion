import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useProductsStore from "../store/productsSrtore";

const ServicesCarousel = () => {
  const [itemsToShow, setItemsToShow] = useState(1);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const { categories, getCategories } = useProductsStore();
  
  // Fetch categories from backend on mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 768) setItemsToShow(2);
      else if (window.innerWidth < 1024) setItemsToShow(3);
      else setItemsToShow(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (category) => {
    // Navigate to services page with hash navigation
    if (category.slug) {
      navigate(`/services#${category.slug}`);
    }
  };

  // Get image based on category - use _id (with underscores) for mapping
  const getCategoryImage = (category) => {
    // Use _id for mapping since it has underscores (e.g., "luxury_logo_collections")
    const categoryId = category._id; // This has underscores
    
    // Direct Unsplash URLs for each category - using _id format (underscores)
    const unsplashImages = {
      "luxury_logo_collections": "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80",
      "branding_identity_packs": "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=300&fit=crop&q=80",
      "social_media_kits": "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&q=80",
      "posters_prints": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop&q=80",
      "mockups": "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop&q=80",
      "3d_fashion_assets": "https://images.unsplash.com/photo-1594736797933-d0401ba94693?w=400&h=300&fit=crop&q=80",
    };
    
    return unsplashImages[categoryId] || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
  };

  // Format category name for display - use title from backend
  const formatCategoryName = (category) => {
    return category.title || category.name || '';
  };

  // Loading state
  if (categories.length === 0) {
    return (
      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-thick snap-x snap-mandatory"
        style={{
          scrollbarWidth: "thin",
          msOverflowStyle: "auto",
        }}
      >
        {categories.map((category) => {
          const imageUrl = getCategoryImage(category);
          const categoryName = formatCategoryName(category);
          
          return (
            <div
              key={category._id}
              className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105 snap-center"
              style={{
                width:
                  itemsToShow === 1
                    ? "80%"
                    : itemsToShow === 2
                    ? "45%"
                    : itemsToShow === 3
                    ? "30%"
                    : "22%",
                minWidth: "250px" // Ensure minimum width
              }}
              onClick={() => handleClick(category)}
            >
              <div className="relative overflow-hidden rounded-lg  group h-full">
                <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden rounded-lg">
                  <img
                    src={imageUrl}
                    alt={categoryName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=300&fit=crop&q=80";
                    }}
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                </div>
                <p className="text-center font-semibold text-black  text-sm sm:text-base md:text-lg lg:text-xl px-2 break-words">
                  {categoryName}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-thick::-webkit-scrollbar {
          height: 8px;
        }
        .scrollbar-thick::-webkit-scrollbar-thumb {
          background-color: #888;
          border-radius: 4px;
        }
        .scrollbar-thick::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        /* Ensure images are visible */
        img {
          display: block;
          max-width: 100%;
          height: auto;
        }
        
        /* Debug styles - remove in production */
        .debug-border {
          border: 2px solid red !important;
        }
      `}</style>
    </div>
  );
};

export default ServicesCarousel;