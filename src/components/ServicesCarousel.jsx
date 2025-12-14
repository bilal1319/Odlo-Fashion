import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ServicesCarousel = ({ services }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef();

  const totalServices = services.length;
  const itemsToShow = 4; 

  const getVisibleItems = () => {
    const items = [];
    
    for (let i = 0; i < itemsToShow; i++) {
      let index = (currentIndex + i) % totalServices;
      items.push(services[index]);
    }
    
    return items;
  };

  const visibleItems = getVisibleItems();

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalServices);
  }, [isTransitioning, totalServices]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => 
      prev === 0 ? totalServices - 1 : prev - 1
    );
  }, [isTransitioning, totalServices]);

  const goToSlide = (index) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Auto-slide
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [nextSlide]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-12">
      {/* Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute top-1/2 -translate-y-1/2 left-0 bg-black/80 hover:bg-black text-white p-3 rounded-full z-10 disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute top-1/2 -translate-y-1/2 right-0 bg-black/80 hover:bg-black text-white p-3 rounded-full z-10 disabled:opacity-50"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Visible Items */}
      <div className="flex justify-center space-x-6">
        {visibleItems.map((service, index) => (
          <div key={`${service.name}-${index}`} className="flex-shrink-0 w-64">
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img
                src={service.img}
                alt={service.name}
                className="w-full h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-center font-semibold text-black mt-3 text-lg">
              {service.name}
            </p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-black scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesCarousel;