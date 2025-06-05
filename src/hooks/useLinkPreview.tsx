
import { useState, useEffect } from 'react';

interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

// Simple URL regex to detect links
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

export const useLinkPreview = (content: string) => {
  const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urls = content.match(URL_REGEX) || [];
    const uniqueUrls = [...new Set(urls)];
    
    if (uniqueUrls.length === 0) {
      setLinkPreviews([]);
      return;
    }

    const fetchPreviews = async () => {
      setIsLoading(true);
      try {
        const previews = await Promise.all(
          uniqueUrls.map(async (url) => {
            try {
              const response = await fetch('/api/fetch-link-preview', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
              });
              
              if (response.ok) {
                return await response.json();
              }
              throw new Error('Failed to fetch preview');
            } catch (error) {
              console.error('Error fetching preview for', url, error);
              // Return basic preview on error
              return {
                url,
                title: new URL(url).hostname,
                description: 'Click to view this link',
                siteName: new URL(url).hostname,
              };
            }
          })
        );
        
        setLinkPreviews(previews);
      } catch (error) {
        console.error('Error fetching link previews:', error);
        setLinkPreviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviews();
  }, [content]);

  return { linkPreviews, isLoading };
};
