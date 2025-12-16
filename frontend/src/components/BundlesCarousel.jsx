import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const BundleCarousel = ({ services }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(4); // Default for desktop
  const intervalRef = useRef();

  const totalServices = services.length;

  // Responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2); // Tablet
      } else if (window.innerWidth < 1280) {
        setItemsToShow(3); // Small desktop
      } else {
        setItemsToShow(4); // Large desktop
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [nextSlide]);

  // Handle touch events for mobile swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="relative w-full bg-[#f4e6d9] py-3 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Arrows - Hidden on mobile, shown on tablet and above */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-0 md:left-2 lg:left-0 bg-black/80 hover:bg-black text-white p-2 sm:p-3 rounded-full z-10 disabled:opacity-50 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-0 md:right-2 lg:right-0 bg-black/80 hover:bg-black text-white p-2 sm:p-3 rounded-full z-10 disabled:opacity-50 transition-all"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Visible Items */}
      <div 
        className="flex justify-center items-center space-x-4 sm:space-x-6 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {visibleItems.map((service, index) => (
          <div 
            key={`${service.name}-${currentIndex}-${index}`} 
            className={`flex-shrink-0 transition-all duration-500 ${
              itemsToShow === 1 ? "w-full max-w-xs" :
              itemsToShow === 2 ? "w-1/2 max-w-xs" :
              itemsToShow === 3 ? "w-1/3 max-w-xs" :
              "w-64"
            }`}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group mx-2">
              <img
                src={service.img}
                alt={service.name}
                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-center font-semibold text-black mt-3 text-base sm:text-lg md:text-xl px-2">
              {service.name}
            </p>
          </div>
        ))}
      </div>

      {/* Dots - Responsive size and spacing */}
      <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-black scale-110' 
                : 'bg-gray-300 hover:bg-gray-400'
            } ${
              itemsToShow <= 2 ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Navigation Arrows - Only visible on mobile */}
      <div className="flex justify-center sm:hidden mt-6 space-x-8">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="bg-black/80 hover:bg-black text-white p-3 rounded-full disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="bg-black/80 hover:bg-black text-white p-3 rounded-full disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default BundleCarousel;