import React, { useState, useRef, MouseEvent, useEffect } from 'react';

interface ImageModalZoomProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  selectedIndex: number;
  productTitle: string;
  theme: {
    accent: string;
    primary: string;
  };
}

const ImageModalZoom: React.FC<ImageModalZoomProps> = ({ 
  isOpen, 
  onClose, 
  images, 
  selectedIndex, 
  productTitle,
  theme 
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(selectedIndex);
  }, [selectedIndex]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const rect = modalRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-20 right-6 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
        aria-label="Close"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Thumbnail Navigation */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 max-h-[80vh] overflow-y-auto no-scrollbar">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-16 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              currentIndex === index 
                ? 'border-white scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Main Zoomed Image */}
      <div 
        ref={modalRef}
        className="relative w-[70%] h-[80vh] mt-10 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="w-full h-full overflow-hidden rounded-2xl"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: '200%',
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
            backgroundRepeat: 'no-repeat',
            transition: 'background-position 0.1s ease-out',
          }}
        />
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(prev => prev - 1);
          }}
          className="absolute left-24 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(prev => prev + 1);
          }}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ImageModalZoom;
