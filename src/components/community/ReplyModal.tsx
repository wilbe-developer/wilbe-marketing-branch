
import { useState } from 'react';
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

interface ReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  threadTitle?: string;
}

export const ReplyModal = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  isSubmitting,
  threadTitle
}: ReplyModalProps) => {
  const [content, setContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; name: string; path: string }>>([]);
  
  const { uploadFile, isUploading, deleteFile } = useSupabaseFileUpload();
  const { linkPreviews } = useLinkPreview(content);
  const isMobile = useIsMobile();

  // Priority logic: show images if any exist, otherwise show link previews
  const shouldShowImages = uploadedImages.length > 0;
  const shouldShowLinkPreviews = !shouldShowImages && linkPreviews.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    
    try {
      let finalContent = content;
      
      // Add image references to content if any
      if (uploadedImages.length > 0) {
        finalContent += '\n\n---\n**Attached Images:**\n';
        uploadedImages.forEach(img => {
          finalContent += `![${img.name}](${img.url})\n`;
        });
      }

      await onSubmit(finalContent);
      
      // Reset form
      setContent('');
      setUploadedImages([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit reply');
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
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    await deleteFile(imagePath);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] w-full' : 'max-w-2xl max-h-[80vh]'} overflow-hidden flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            Reply to: {threadTitle}
          </DialogTitle>
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
            disabled={isSubmitting || isUploading}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Posting...' : 'Post Reply'}
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
