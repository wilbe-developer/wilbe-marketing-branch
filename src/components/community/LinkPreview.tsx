
import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

export const LinkPreview = ({ url, title, description, image, siteName }: LinkPreviewProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        {image && !imageError && (
          <div className="w-full h-48 overflow-hidden bg-gray-200 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img 
              src={image} 
              alt={title || 'Preview'} 
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        )}
        
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="h-4 w-4 text-gray-500 flex-shrink-0" />
            {siteName && (
              <span className="text-sm text-gray-600 font-medium">{siteName}</span>
            )}
          </div>
          
          {title && (
            <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
              {title}
            </h4>
          )}
          
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {description}
            </p>
          )}
          
          <p className="text-xs text-gray-500 truncate">
            {url}
          </p>
        </div>
      </a>
    </div>
  );
};
