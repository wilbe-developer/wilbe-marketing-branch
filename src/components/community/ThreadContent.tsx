
import { extractImages, removeImageMarkdown, parseMarkdown } from '@/utils/markdownUtils';
import { cleanupContent } from '@/utils/contentUtils';
import { ImageGrid } from './ImageGrid';
import { useLinkPreview } from '@/hooks/useLinkPreview';
import { LinkPreview } from './LinkPreview';

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
  // Extract images from raw content BEFORE any cleanup
  const images = extractImages(content);
  
  // Now clean up content for text display
  const cleanedContent = cleanupContent(content);
  const textContent = removeImageMarkdown(cleanedContent);
  const { linkPreviews } = useLinkPreview(textContent);

  // Priority logic: show images if any exist, otherwise show link previews
  const shouldShowImages = showImages && images.length > 0;
  const shouldShowLinkPreviews = !shouldShowImages && linkPreviews.length > 0;

  // For preview mode (community page), show truncated text
  if (isPreview) {
    return (
      <div className={className}>
        <div 
          className="text-gray-600 line-clamp-2 whitespace-pre-wrap prose-sm prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(textContent) }}
        />
        
        {shouldShowImages && (
          <ImageGrid images={images} maxImages={2} />
        )}

        {shouldShowLinkPreviews && (
          <div className="mt-2">
            <LinkPreview 
              url={linkPreviews[0].url}
              title={linkPreviews[0].title}
              description={linkPreviews[0].description}
              image={linkPreviews[0].image}
              siteName={linkPreviews[0].siteName}
            />
          </div>
        )}
      </div>
    );
  }

  // For full thread view, show complete content with proper markdown parsing
  return (
    <div className={className}>
      <div 
        className="prose max-w-none text-gray-900 whitespace-pre-wrap prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:underline"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(textContent) }}
      />
      
      {shouldShowImages && (
        <ImageGrid images={images} maxImages={4} />
      )}

      {shouldShowLinkPreviews && (
        <div className="mt-4 space-y-2">
          {linkPreviews.map((link, index) => (
            <LinkPreview 
              key={index}
              url={link.url}
              title={link.title}
              description={link.description}
              image={link.image}
              siteName={link.siteName}
            />
          ))}
        </div>
      )}
    </div>
  );
};
