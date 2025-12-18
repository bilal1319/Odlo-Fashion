import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BundleCarousel = ({ services }) => {
  const [itemsToShow, setItemsToShow] = useState(4);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  // Responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else if (window.innerWidth < 1280) setItemsToShow(3);
      else setItemsToShow(4);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (index) => {
    navigate(`/bundles`);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 bg-[#f4e6d9]">
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
            className="shrink-0 cursor-pointer" // Make clickable
            style={{
              width:
                itemsToShow === 1
                  ? "90%"
                  : itemsToShow === 2
                  ? "50%"
                  : itemsToShow === 3
                  ? "35%"
                  : "28%",
            }}
            onClick={() => handleClick()} // Navigate on click
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={service.img}
                alt={service.name}
                className="w-full min-h-64 sm:min-h-80 md:min-h-106 object-cover rounded-lg"
                loading="lazy"
              />
            </div>
            <p className="text-center font-bold  text-black mt-2 text-base sm:text-lg md:text-xl px-2">
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

export default BundleCarousel;
