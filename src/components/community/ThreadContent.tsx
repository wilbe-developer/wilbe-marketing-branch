
import { extractImages, removeImageMarkdown, parseMarkdown } from '@/utils/markdownUtils';
import { ImageGrid } from './ImageGrid';

interface ThreadContentProps {
  content: string;
  showImages?: boolean;
  className?: string;
  isPreview?: boolean;
}

export const ThreadContent = ({ 
  content, 
  showImages = true, 
  className = '', 
  isPreview = false 
}: ThreadContentProps) => {
  const images = extractImages(content);
  const textContent = removeImageMarkdown(content);

  // For preview mode (community page), show truncated text
  if (isPreview) {
    return (
      <div className={className}>
        <p className="text-gray-600 line-clamp-2 whitespace-pre-wrap">
          {textContent}
        </p>
        
        {showImages && images.length > 0 && (
          <ImageGrid images={images} maxImages={2} />
        )}
      </div>
    );
  }

  // For full thread view, show complete content with proper markdown parsing
  return (
    <div className={className}>
      <div 
        className="prose max-w-none text-gray-900 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(textContent) }}
      />
      
      {showImages && images.length > 0 && (
        <ImageGrid images={images} maxImages={4} />
      )}
    </div>
  );
};
