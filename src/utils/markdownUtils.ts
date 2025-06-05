
/**
 * Simple markdown parser for basic formatting
 * Supports: **bold**, line breaks, [link](url) syntax, and ![alt](image) syntax
 */
export const parseMarkdown = (text: string): string => {
  if (!text) return '';
  
  return text
    // Convert **bold** to <strong>bold</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert [text](url) to <a href="url" target="_blank" rel="noopener noreferrer">text</a>
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>');
};

/**
 * Extract image URLs from markdown content
 */
export const extractImages = (text: string): Array<{ alt: string; url: string }> => {
  if (!text) return [];
  
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images: Array<{ alt: string; url: string }> = [];
  let match;
  
  while ((match = imageRegex.exec(text)) !== null) {
    images.push({
      alt: match[1] || 'Image',
      url: match[2],
    });
  }
  
  return images;
};

/**
 * Remove markdown image syntax from text
 */
export const removeImageMarkdown = (text: string): string => {
  if (!text) return '';
  return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '');
};

/**
 * Check if text contains markdown syntax
 */
export const containsMarkdown = (text: string): boolean => {
  if (!text) return false;
  
  // Check for bold syntax, links, images, or multiple line breaks
  return /\*\*.*?\*\*|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|\n\n/.test(text);
};
