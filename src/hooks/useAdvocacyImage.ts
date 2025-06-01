
import { useState, useEffect } from 'react';

export const useAdvocacyImage = () => {
  const [advocacyImageUrl, setAdvocacyImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Use the static Supabase URL instead of uploading
    const staticImageUrl = "https://iatercfyoclqxmohyyke.supabase.co/storage/v1/object/public/images/scientists-first-advocacy-team.png";
    setAdvocacyImageUrl(staticImageUrl);
  }, []);

  return advocacyImageUrl;
};
