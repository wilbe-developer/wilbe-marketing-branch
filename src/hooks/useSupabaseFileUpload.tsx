
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UploadResult {
  url: string;
  path: string;
  id: string;
}

interface UseSupabaseFileUploadReturn {
  uploadFile: (file: File, options?: { onSuccess?: (result: UploadResult) => void; onError?: (error: Error) => void }) => Promise<UploadResult | null>;
  isUploading: boolean;
  deleteFile: (path: string) => Promise<boolean>;
}

export const useSupabaseFileUpload = (): UseSupabaseFileUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const uploadFile = async (
    file: File,
    options?: { onSuccess?: (result: UploadResult) => void; onError?: (error: Error) => void }
  ): Promise<UploadResult | null> => {
    if (!user) {
      const error = new Error('User not authenticated');
      options?.onError?.(error);
      return null;
    }

    setIsUploading(true);

    try {
      // Create a unique file path with user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('community-uploads')
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('community-uploads')
        .getPublicUrl(data.path);

      const result = {
        url: publicUrl,
        path: data.path,
        id: data.path // Using path as ID for simplicity
      };

      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      const uploadError = error instanceof Error ? error : new Error('Upload failed');
      options?.onError?.(uploadError);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from('community-uploads')
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  return {
    uploadFile,
    isUploading,
    deleteFile
  };
};
