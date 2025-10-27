import React, { useState } from 'react';

export function ImageWithFallback({ src, alt, className, fallback = '🎉' }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-er-primary/30 to-er-secondary/30 flex items-center justify-center`}>
        <span className="text-6xl">{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-er-primary/20 to-er-secondary/20 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-er-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: imageLoading ? 'none' : 'block' }}
      />
    </div>
  );
}
