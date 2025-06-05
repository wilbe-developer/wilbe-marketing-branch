
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageGridProps {
  images: Array<{ alt: string; url: string }>;
  maxImages?: number;
}

export const ImageGrid = ({ images, maxImages = 4 }: ImageGridProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const isMobile = useIsMobile();
  
  const displayImages = images.slice(0, maxImages);
  const remainingCount = Math.max(0, images.length - maxImages);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set([...prev, index]));
  };

  if (displayImages.length === 0) return null;

  // Single image - use natural aspect ratio
  if (displayImages.length === 1) {
    const image = displayImages[0];
    return (
      <div className="mt-3">
        <div className="relative overflow-hidden rounded-lg border max-w-full">
          {!loadedImages.has(0) && !failedImages.has(0) && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {!failedImages.has(0) && (
            <img
              src={image.url}
              alt={image.alt}
              className={`max-w-full h-auto max-h-96 object-contain ${
                loadedImages.has(0) ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-200`}
              onLoad={() => handleImageLoad(0)}
              onError={() => handleImageError(0)}
              loading="lazy"
            />
          )}
        </div>
      </div>
    );
  }

  // Multiple images - grid layout
  const getGridClass = () => {
    if (isMobile) {
      return displayImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2';
    }
    return displayImages.length === 2 ? 'grid-cols-2' : 
           displayImages.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
  };

  return (
    <div className="mt-3">
      <div className={`grid ${getGridClass()} gap-2`}>
        {displayImages.map((image, index) => (
          <div key={index} className="relative">
            <div className="relative overflow-hidden rounded border aspect-square">
              {!loadedImages.has(index) && !failedImages.has(index) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              {!failedImages.has(index) && (
                <img
                  src={image.url}
                  alt={image.alt}
                  className={`w-full h-full object-cover ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  } transition-opacity duration-200`}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
              )}
              
              {/* Overlay for additional images count */}
              {remainingCount > 0 && index === displayImages.length - 1 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
