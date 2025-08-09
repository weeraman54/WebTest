import React, { useState, useEffect, useCallback } from "react";

interface BannerProps {
  images: string[];
  height?: string;
  autoSlideInterval?: number;
}

const Banner: React.FC<BannerProps> = ({
  images,
  height = "h-96",
  autoSlideInterval = 8000,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);

  // Optimize image transitions and reduce repaints
  const goToSlide = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Optimize the main container with mobile-first responsive height
  return (
    <div
      className={`relative w-full ${height} overflow-hidden bg-gray-900 shadow-lg`}
      style={{
        transform: "translateZ(0)", // Force hardware acceleration
        willChange: "auto",
        // Mobile-specific adjustments
        minHeight: "200px", // Ensure minimum height on very small screens
        maxHeight: "100vh", // Prevent banner from exceeding viewport height
      }}
    >
      {/* Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ease-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transform: "translateZ(0)",
            willChange: index === currentImageIndex ? "opacity" : "auto",
          }}
        >
          <img
            src={image}
            alt={`Banner ${index + 1}`}
            style={{
              objectFit: "cover",
              objectPosition: "center 20%",
              width: "100%",
              height: "100%",
              transform: "translateZ(0)", // Hardware acceleration
              imageRendering: "auto",
            }}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}

      {/* Navigation Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 rounded-full px-2 sm:px-3 py-1 sm:py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full cursor-pointer transition-all duration-300 focus:outline-none ${
                index === currentImageIndex
                  ? "bg-white scale-125 sm:scale-150"
                  : "bg-white/40 hover:bg-white/70 hover:scale-110 sm:hover:scale-125"
              }`}
              style={{
                width: "8px",
                height: "8px",
                minWidth: "8px",
                minHeight: "8px",
                maxWidth: "8px",
                maxHeight: "8px",
                borderRadius: "50%",
                border: "none",
                padding: "0",
                flexShrink: 0,
              }}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows for larger screens */}
      {images.length > 1 && (
        <>
          {/* Previous Arrow */}
          <button
            onClick={() => {
              goToSlide(
                currentImageIndex === 0
                  ? images.length - 1
                  : currentImageIndex - 1
              );
              // Remove focus after click to prevent persistent hover state
              (document.activeElement as HTMLElement)?.blur();
            }}
            onMouseLeave={() => {
              // Ensure button loses focus when mouse leaves
              (document.activeElement as HTMLElement)?.blur();
            }}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 focus:outline-none opacity-75 hover:opacity-100"
            aria-label="Previous image"
            type="button"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            onClick={() => {
              goToSlide(
                currentImageIndex === images.length - 1
                  ? 0
                  : currentImageIndex + 1
              );
              // Remove focus after click to prevent persistent hover state
              (document.activeElement as HTMLElement)?.blur();
            }}
            onMouseLeave={() => {
              // Ensure button loses focus when mouse leaves
              (document.activeElement as HTMLElement)?.blur();
            }}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 focus:outline-none opacity-75 hover:opacity-100"
            aria-label="Next image"
            type="button"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;