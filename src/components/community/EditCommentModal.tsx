
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from 'lucide-react';
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload';
import { useLinkPreview } from '@/hooks/useLinkPreview';
import { LinkPreview } from './LinkPreview';
import { ThreadComment } from '@/types/community';
import { extractImages, removeImageMarkdown } from '@/utils/markdownUtils';
import { cleanupContent } from '@/utils/contentUtils';
import { supabase } from '@/integrations/supabase/client';

interface EditCommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: ThreadComment;
  onCommentUpdated: () => void;
}

export const EditCommentModal = ({ 
  open, 
  onOpenChange, 
  comment,
  onCommentUpdated
}: EditCommentModalProps) => {
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; name: string; path: string }>>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { uploadFile, isUploading, deleteFile } = useSupabaseFileUpload();
  const { linkPreviews } = useLinkPreview(content);
  const isMobile = useIsMobile();

  // Priority logic: show images if any exist, otherwise show link previews
  const shouldShowImages = uploadedImages.length > 0;
  const shouldShowLinkPreviews = !shouldShowImages && linkPreviews.length > 0;

  // Set form data when modal opens
  useEffect(() => {
    if (open && comment) {
      // Extract images from content and remove them from the text
      const images = extractImages(comment.content);
      const cleanedContent = cleanupContent(removeImageMarkdown(comment.content));
      
      setContent(cleanedContent);
      
      // Convert extracted images to uploaded images format
      const existingImages = images.map((img, index) => ({
        id: `existing-${index}`,
        url: img.url,
        name: img.alt || 'Existing image',
        path: img.url // For existing images, we use the URL as path
      }));
      setUploadedImages(existingImages);
    }
  }, [open, comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    setIsUpdating(true);
    try {
      let finalContent = content;
      
      // Add image references to content if any
      if (uploadedImages.length > 0) {
        finalContent += '\n\n---\n**Attached Images:**\n';
        uploadedImages.forEach(img => {
          finalContent += `![${img.name}](${img.url})\n`;
        });
      }

      const { error } = await supabase
        .from('thread_comments')
        .update({ 
          content: finalContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', comment.id);

      if (error) throw error;

      toast.success('Reply updated successfully');
      onCommentUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update reply');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    uploadFile(file, {
      onSuccess: (data) => {
        setUploadedImages(prev => [...prev, {
          id: data.id,
          url: data.url,
          name: file.name,
          path: data.path
        }]);
        toast.success('Image uploaded successfully');
      },
      onError: (error) => {
        toast.error(`Upload failed: ${error.message}`);
      }
    });
  };

  const removeImage = async (imageId: string, imagePath: string) => {
    // Remove from state
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    
    // Only delete from Supabase Storage if it's not an existing image
    if (!imageId.startsWith('existing-')) {
      await deleteFile(imagePath);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] w-full' : 'max-w-2xl max-h-[80vh]'} overflow-hidden flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Reply</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Your Reply
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What are your thoughts? (URLs will automatically show previews)"
                rows={6}
                required
                className="w-full resize-none"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Attach Images (optional)
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Upload size={20} />
                    <span className="text-sm">
                      {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                
                {shouldShowImages && (
                  <div className="grid grid-cols-1 gap-2 max-w-full overflow-hidden">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="flex items-center p-2 bg-gray-50 rounded border min-w-0">
                          <img 
                            src={image.url} 
                            alt={image.name}
                            className="w-12 h-12 object-cover rounded mr-2 flex-shrink-0"
                          />
                          <span className="text-sm truncate flex-1 min-w-0">{image.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(image.id, image.path)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Link Previews */}
            {shouldShowLinkPreviews && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Link Previews
                </label>
                <div className="space-y-2 max-w-full overflow-hidden">
                  {linkPreviews.map((link, index) => (
                    <div key={index} className="w-full overflow-hidden">
                      <LinkPreview 
                        url={link.url}
                        title={link.title}
                        description={link.description}
                        image={link.image}
                        siteName={link.siteName}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex gap-3 pt-4 border-t flex-shrink-0">
          <Button 
            type="submit" 
            disabled={isUpdating || isUploading}
            onClick={handleSubmit}
          >
            {isUpdating ? 'Updating...' : 'Update Reply'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
