
import { extractImages, removeImageMarkdown } from '@/utils/markdownUtils';

interface ThreadContentProps {
  content: string;
  showImages?: boolean;
  className?: string;
}

export const ThreadContent = ({ content, showImages = true, className = '' }: ThreadContentProps) => {
  const images = extractImages(content);
  const textContent = removeImageMarkdown(content);

  return (
    <div className={className}>
      <p className="text-gray-600 line-clamp-2 whitespace-pre-wrap">
        {textContent}
      </p>
      
      {showImages && images.length > 0 && (
        <div className="mt-3 space-y-2">
          {images.slice(0, 2).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {images.length > 2 && index === 1 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                  <span className="text-white font-medium">
                    +{images.length - 2} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
