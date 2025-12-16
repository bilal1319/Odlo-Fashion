import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ServicesCarousel = ({ services }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(1);
  const intervalRef = useRef();

  const totalServices = services.length;

  // Responsive items to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1); // Mobile
      } else if (window.innerWidth < 768) {
        setItemsToShow(2); // Small tablet
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3); // Tablet
      } else {
        setItemsToShow(4); // Desktop
      }
    };

    handleResize();
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
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [nextSlide]);

  // Touch swipe functionality
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

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
      {/* Desktop Arrows */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 lg:left-4 
          bg-black/80 hover:bg-black text-white p-2 sm:p-3 rounded-full z-10 
          disabled:opacity-50 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 lg:right-4 
          bg-black/80 hover:bg-black text-white p-2 sm:p-3 rounded-full z-10 
          disabled:opacity-50 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Visible Items Container */}
      <div 
        className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {visibleItems.map((service, index) => (
          <div 
            key={`${service.name}-${currentIndex}-${index}`}
            className={`
              flex-shrink-0 transition-all duration-300 ease-in-out
              ${itemsToShow === 1 ? "w-full max-w-xs px-4" :
                itemsToShow === 2 ? "w-1/2 max-w-sm px-2" :
                itemsToShow === 3 ? "w-1/3 max-w-xs px-2" :
                "w-1/4 max-w-xs px-2"
              }
            `}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl transition-shadow duration-300">
              <img
                src={service.img}
                alt={service.name}
                className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover rounded-lg 
                  transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-center font-semibold text-black mt-2 sm:mt-3 
              text-sm sm:text-base md:text-lg lg:text-xl px-2 break-words">
              {service.name}
            </p>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-4 sm:mt-6 md:mt-8 space-x-1 sm:space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              transition-all duration-300 rounded-full
              ${currentIndex === index 
                ? 'bg-black' 
                : 'bg-gray-300 hover:bg-gray-400'
              }
              ${itemsToShow <= 2 ? 'w-2 h-2' : 
                itemsToShow === 3 ? 'w-2.5 h-2.5' : 
                'w-3 h-3'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Navigation Arrows */}
      <div className="flex justify-center md:hidden mt-6 space-x-8">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="bg-black/80 hover:bg-black text-white p-3 rounded-full 
            disabled:opacity-50 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="bg-black/80 hover:bg-black text-white p-3 rounded-full 
            disabled:opacity-50 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Slide indicator for screen readers */}
      <div className="sr-only">
        Showing {Math.min(itemsToShow, totalServices)} of {totalServices} services
      </div>
    </div>
  );
};

export default ServicesCarousel;