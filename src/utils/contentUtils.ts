
/**
 * Clean up content by removing "Attached Images" sections
 */
export const cleanupContent = (rawContent: string): string => {
  if (!rawContent) return '';
  
  // Remove everything from "---" onwards that contains "Attached Images"
  const sections = rawContent.split('\n---\n');
  if (sections.length > 1) {
    // Check if any section after the first contains "Attached Images"
    const mainContent = sections[0];
    const otherSections = sections.slice(1);
    
    // Filter out sections that contain "Attached Images" or similar patterns
    const filteredSections = otherSections.filter(section => 
      !section.includes('**Attached Images:**') &&
      !section.includes('Attached Images:') &&
      !section.toLowerCase().includes('attached images')
    );
    
    // Rejoin if there are any valid sections left
    if (filteredSections.length > 0) {
      return [mainContent, ...filteredSections].join('\n---\n');
    }
    return mainContent;
  }
  return rawContent;
};
