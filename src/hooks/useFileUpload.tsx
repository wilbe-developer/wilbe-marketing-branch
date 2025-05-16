
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadCallbacks {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File, callbacks?: UploadCallbacks) => {
    setIsUploading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Create custom XMLHttpRequest to track upload progress
      const xhr = new XMLHttpRequest();
      
      // Set up progress tracking
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      // Create a promise to handle the async upload
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.open("POST", "/api/upload-file");
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              console.error("Error parsing response:", error);
              console.error("Response text:", xhr.responseText);
              reject(new Error("Failed to parse server response"));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(errorData);
            } catch (e) {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        };
        
        xhr.onerror = function() {
          reject(new Error("Network error during upload"));
        };
        
        xhr.send(formData);
      });

      // Wait for upload to complete
      const response = await uploadPromise;
      
      // Create entry in user_files table
      if (response && response.fileId) {
        const { data: fileData, error: fileError } = await supabase
          .from("user_files")
          .insert({
            file_name: file.name,
            drive_file_id: response.fileId,
            view_url: response.viewLink,
            download_url: response.downloadLink
          })
          .select()
          .single();
          
        if (fileError) {
          console.error("Error saving file to database:", fileError);
          if (callbacks?.onError) {
            callbacks.onError({ message: "Failed to save file information" });
          }
          return;
        }
        
        // Success
        if (callbacks?.onSuccess) {
          callbacks.onSuccess({ 
            ...response, 
            id: fileData.id,
            fileId: fileData.id
          });
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      
      if (callbacks?.onError) {
        callbacks.onError(error);
      } else {
        toast.error(`Upload failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress };
};

export default useFileUpload;
