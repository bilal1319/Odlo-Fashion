import { useState, useEffect, useRef } from "react";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img8.jpg";
import img3 from "../assets/img11.jpg";
import img4 from "../assets/img13.jpg";
import image1 from "../assets/image1.jpg";
import image11 from "../assets/image5.jpg";

// Define slide data with images and text
const slides = [
  { image: image1, text: "Welcome to Odlo Center", subtext: "Discover our services" },
  { image: img2, text: "Welcome to Odlo Center", subtext: "Discover our services" },
  { image: image11, text: "Welcome to Odlo Center", subtext: "Discover our services" },
  { image: img4, text: "Welcome to Odlo Center", subtext: "Discover our services" },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  
  // Auto-slide interval duration
  const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

  // Function to start/reset auto-slide
  const startAutoSlide = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start new interval
    intervalRef.current = setInterval(() => {
      goToNext();
    }, AUTO_SLIDE_INTERVAL);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    // Reset auto-slide timer when manually navigating
    startAutoSlide();
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    // Reset auto-slide timer when manually navigating
    startAutoSlide();
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    // Reset auto-slide timer when manually navigating
    startAutoSlide();
  };

  // Initialize auto-slide on component mount
  useEffect(() => {
    startAutoSlide();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset transitioning state after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match this with CSS transition duration
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Handle touch swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden bg-black">
      <div 
        className="relative w-full h-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides container */}
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={index}
              className="relative w-full h-full flex-shrink-0"
            >
              {/* Image */}
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/30"></div>
              
              {/* Centered Text Container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="transform transition-all duration-700 delay-200"
                  style={{
                    opacity: index === currentIndex ? 1 : 0.5,
                    transform: `translateY(${index === currentIndex ? '0' : '20px'})`
                  }}
                >
                  {/* Main Text */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4
                    drop-shadow-lg">
                    {slide.text}
                  </h2>
                  
                  {/* Subtext */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto
                    drop-shadow-md">
                    {slide.subtext}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          disabled={isTransitioning}
          className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20
            bg-black/40 hover:bg-black/60 text-white
            w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
            text-xl sm:text-3xl transition-all duration-300
            ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          disabled={isTransitioning}
          className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20
            bg-black/40 hover:bg-black/60 text-white
            w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
            text-xl sm:text-3xl transition-all duration-300
            ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/70"
              } ${
                isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${
                index === currentIndex 
                  ? "w-2.5 h-2.5 sm:w-3 sm:h-3" 
                  : "w-2 h-2 sm:w-2.5 sm:h-2.5"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Screen Reader Info */}
      <div className="sr-only">
        Slide {currentIndex + 1} of {slides.length}: {slides[currentIndex].text}. {slides[currentIndex].subtext}
      </div>
    </div>
  );
};

export default Carousel;