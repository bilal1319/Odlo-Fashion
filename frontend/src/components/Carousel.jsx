import { useState, useEffect } from "react";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img8.jpg";
import img3 from "../assets/img11.jpg";
import img4 from "../assets/img13.jpg";
import image1 from "../assets/image1.jpg"

const images = [image1, img2, img3, img4];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

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
    if (!touchStart || !touchEnd) return;
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
    <div 
      className="relative w-full  h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Left arrow - Responsive sizing */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 cursor-pointer sm:left-4  top-1/2 -translate-y-1/2 z-10
          bg-black/50 hover:bg-black/70 text-white
          w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
          text-xl sm:text-3xl transition-all duration-300"
        aria-label="Previous slide"
      >
        ‹
      </button>

      {/* Right arrow - Responsive sizing */}
      <button
        onClick={goToNext}
        className="absolute cursor-pointer right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10
          bg-black/50 hover:bg-black/70 text-white
          w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
          text-xl sm:text-3xl transition-all duration-300"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots - Responsive sizing and positioning */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? "bg-white scale-110" 
                : "bg-white/50 hover:bg-white/70"
            } ${
              index === currentIndex 
                ? "w-1.5 h-1.5 sm:w-2.5 sm:h-2.5" 
                : "w-1 h-1 sm:w-2 sm:h-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter for screen readers */}
      <div className="sr-only">
        Slide {currentIndex + 1} of {images.length}
      </div>
    </div>
  );
};

export default Carousel;