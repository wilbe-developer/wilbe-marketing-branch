
import { useState, useEffect } from 'react';
import { uploadAdvocacyImage } from '@/utils/uploadAdvocacyImage';

export const useAdvocacyImage = () => {
  const [advocacyImageUrl, setAdvocacyImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const setupAdvocacyImage = async () => {
      const imageUrl = await uploadAdvocacyImage();
      if (imageUrl) {
        setAdvocacyImageUrl(imageUrl);
      }
    };
    setupAdvocacyImage();
  }, []);

  return advocacyImageUrl;
};
