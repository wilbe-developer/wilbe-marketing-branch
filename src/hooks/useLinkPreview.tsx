
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

    // For now, create basic previews without fetching metadata
    // In a real implementation, you'd fetch Open Graph data from the URLs
    const previews: LinkPreview[] = uniqueUrls.map(url => {
      // Detect common platforms and provide better previews
      let siteName = 'Website';
      let title = url;
      
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        siteName = 'YouTube';
        title = 'YouTube Video';
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        siteName = 'Twitter/X';
        title = 'Twitter Post';
      } else if (url.includes('linkedin.com')) {
        siteName = 'LinkedIn';
        title = 'LinkedIn Post';
      } else if (url.includes('github.com')) {
        siteName = 'GitHub';
        title = 'GitHub Repository';
      }

      return {
        url,
        title,
        siteName,
        description: 'Click to view this link'
      };
    });

    setLinkPreviews(previews);
  }, [content]);

  return { linkPreviews, isLoading };
};
