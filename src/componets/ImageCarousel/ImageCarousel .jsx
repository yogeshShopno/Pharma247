import React, { useRef, useState, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";

const ImageCarousel = ({ imageUrls }) => {
  const scrollRef = useRef(null);
  const [modal, setModal] = useState({ open: false, index: -1 });

  // Scroll by a fixed amount
  const scroll = (offset) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const openModal = (index) => setModal({ open: true, index });
  const closeModal = () => setModal({ open: false, index: -1 });

  const navigate = (direction) => {
    const newIndex = modal.index + direction;
    if (newIndex >= 0 && newIndex < imageUrls.length) {
      setModal((prev) => ({ ...prev, index: newIndex }));
    }
  };

  useEffect(() => {
    if (!modal.open) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") navigate(-1); // Go to the previous image
      if (e.key === "ArrowRight") navigate(1); // Go to the next image
      if (e.key === "Escape") closeModal(); // Close modal on Escape
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modal.open, modal.index, imageUrls.length]);

  return (
    <>
      {/* Carousel */}
      <div
        className="relative w-full max-w-4xl mx-auto"
        style={{ minHeight: "9rem" }}
      >
        {/* Left Arrow */}
        {imageUrls.length > 3 && (
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 shadow-lg pr-4 pl-2 py-2 rounded-full"
            style={{
              height: "2rem",
              width: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color1)",
            }}
            onClick={() => scroll(-140)} // Scroll left
            aria-label="Scroll Left"
          >
            <span className="text-sm text-white">
              <ArrowBackIosIcon />
            </span>
          </button>
        )}

        {/* Images */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto py-4 px-10 scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: "smooth" }}
        >
          {imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Image ${idx + 1}`}
              className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-xl shadow-md cursor-pointer flex-shrink-0 transition-transform hover:scale-105 border border-gray-100"
              onClick={() => openModal(idx)}
              loading="lazy"
            />
          ))}
        </div>

        {/* Right Arrow */}
        {imageUrls.length > 3 && (
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 shadow-lg pl-4 pr-2 py-2 rounded-full"
            style={{
              height: "2rem",
              width: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color1)",
            }}
            onClick={() => scroll(140)} // Scroll right
            aria-label="Scroll Right"
          >
            <span className="text-sm text-white">
              <ArrowForwardIosIcon />
            </span>
          </button>
        )}
      </div>

      {/* Modal (same as before, unchanged) */}
      {modal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85"
          onClick={closeModal}
        >
          {/* Close Button */}
          
          <button
            className="absolute top-2 right-2 bg-red-500 opacity-90 shadow-lg p-2 rounded-full z-10"
            onClick={closeModal}
            aria-label="Close"
          >
            <span className=" font-bold text-white">
             
              <CloseIcon />
            </span>
          </button>

          {/* Left Arrow */}
          {modal.index > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 shadow-lg pr-4 pl-2 py-2 rounded-full"
              onClick={() => navigate(-1)} // Navigate to previous image
              aria-label="Previous"
              style={{
                height: "3rem",
                width: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--color1)",
              }}
            >
              <span className="text-sm text-white">
                <ArrowBackIosIcon />
              </span>
            </button>
          )}

          {/* Right Arrow */}
          {modal.index < imageUrls.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 shadow-lg pl-4 pr-2 py-2 rounded-full"
              onClick={() => navigate(1)} // Navigate to next image
              aria-label="Next"
              style={{
                height: "3rem",
                width: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--color1)",
              }}
            >
              <span className="text-sm text-white">
                <ArrowForwardIosIcon />
              </span>
            </button>
          )}
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--color1)",
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-semibold  bg-opacity-67 rounded-xl py-1 px-4"
          >
            {modal.index + 1} / {imageUrls.length}
          </div>
          {/* Image Display */}
          <div
            className="relative flex flex-col items-center max-w-[94vw] max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={imageUrls[modal.index]}
              alt={`Preview ${modal.index + 1}`}
              className="rounded-xl shadow-xl bg-white max-h-[80vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default ImageCarousel;
