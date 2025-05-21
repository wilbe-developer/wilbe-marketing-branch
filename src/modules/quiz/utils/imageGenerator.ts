
import html2canvas from 'html2canvas';

export const generateAndDownloadImage = async (elementId: string, questionText: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error("Element not found");
      return;
    }
    
    // Add flash effect for taking screenshot
    const flashEffect = document.createElement('div');
    flashEffect.style.position = 'fixed';
    flashEffect.style.top = '0';
    flashEffect.style.left = '0';
    flashEffect.style.width = '100%';
    flashEffect.style.height = '100%';
    flashEffect.style.background = 'white';
    flashEffect.style.opacity = '0';
    flashEffect.style.pointerEvents = 'none';
    flashEffect.style.transition = 'opacity 0.5s';
    flashEffect.style.zIndex = '9999';
    document.body.appendChild(flashEffect);
    
    // Trigger the flash effect
    setTimeout(() => {
      flashEffect.style.opacity = '0.8';
      setTimeout(() => {
        flashEffect.style.opacity = '0';
      }, 120);
    }, 100);
    
    // Generate canvas with higher quality settings - directly use the existing element
    const canvas = await html2canvas(element, {
      backgroundColor: 'transparent',
      scale: 2, // Higher resolution
      logging: false,
      allowTaint: true,
      useCORS: true,
      imageTimeout: 0
    });
    
    // Clean up flash effect after capture
    document.body.removeChild(flashEffect);
    
    // Convert canvas to blob with high quality
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Could not generate image");
        return;
      }
      
      try {
        // Create a ClipboardItem and write to clipboard
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        console.log("Screenshot copied to clipboard");
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
        
        // Fallback to download if clipboard API fails
        const link = document.createElement('a');
        link.download = `quiz-question-${Date.now()}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    }, 'image/png', 0.95); // High quality PNG
    
  } catch (error) {
    console.error("Error generating image:", error);
  }
};
