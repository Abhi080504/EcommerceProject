import React, { useState, useRef, MouseEvent } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  theme: {
    accent: string;
    primary: string;
  };
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className, containerClassName, theme }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Lens size
    const lensSize = 150;
    const halfLens = lensSize / 2;

    // Calculate lens position (keep within bounds)
    const lensX = Math.max(halfLens, Math.min(x, rect.width - halfLens));
    const lensY = Math.max(halfLens, Math.min(y, rect.height - halfLens));

    setLensPosition({ x: lensX - halfLens, y: lensY - halfLens });

    // Calculate zoom position (2.5x magnification)
    const zoomScale = 2.5;
    const zoomX = ((lensX / rect.width) * 100);
    const zoomY = ((lensY / rect.height) * 100);

    setZoomPosition({ x: zoomX, y: zoomY });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  return (
    <div className={`relative w-full h-full ${containerClassName || ''}`}>
      <div
        ref={imageRef}
        className="relative w-full h-full overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className={className || 'w-full h-full object-cover'}
        />

        {/* Magnifier Lens */}
        {isZooming && (
          <div
            className="absolute pointer-events-none border-2 rounded-full overflow-hidden transition-opacity duration-200"
            style={{
              width: '150px',
              height: '150px',
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
              borderColor: theme.accent,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(2px)',
              boxShadow: `0 0 20px ${theme.accent}66`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${src})`,
                backgroundSize: '250%',
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          </div>
        )}

        {/* Hover Overlay Effect */}
        {isZooming && (
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 200px at ${lensPosition.x + 75}px ${lensPosition.y + 75}px, transparent 0%, rgba(0,0,0,0.1) 100%)`,
            }}
          />
        )}
      </div>

      {/* Zoom Indicator */}
      {isZooming && (
        <div 
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 opacity-100"
          style={{
            backgroundColor: `${theme.accent}1a`,
            color: theme.accent,
            borderColor: `${theme.accent}33`,
            border: '1px solid',
          }}
        >
          🔍 Zooming
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
