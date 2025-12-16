import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ServicesCarousel = ({ services }) => {
  const [itemsToShow, setItemsToShow] = useState(1);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

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

  const handleClick = (index) => {
    navigate(`/services/${index}`);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-4">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-thick"
        style={{
          scrollbarWidth: "thin",
          msOverflowStyle: "auto",
        }}
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="flex-shrink-0 cursor-pointer" // Make clickable
            style={{
              width:
                itemsToShow === 1
                  ? "80%"
                  : itemsToShow === 2
                  ? "45%"
                  : itemsToShow === 3
                  ? "30%"
                  : "22%",
            }}
            onClick={() => handleClick(index + 1)} // Navigate on click
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={service.img}
                alt={service.name}
                className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <p className="text-center font-serif font-semibold text-black mt-2 text-sm sm:text-base md:text-lg lg:text-xl px-2 break-words">
              {service.name}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-thick::-webkit-scrollbar {
          height: 10px;
        }
        .scrollbar-thick::-webkit-scrollbar-thumb {
          background-color: #999;
          border-radius: 5px;
          
        }
        .scrollbar-thick::-webkit-scrollbar-track {
          background: #e0e0e0;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default ServicesCarousel;
