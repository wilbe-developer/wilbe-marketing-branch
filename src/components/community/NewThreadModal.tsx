import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Challenge, Thread } from '@/types/community';
import { Upload, X } from 'lucide-react';
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload';
import { useLinkPreview } from '@/hooks/useLinkPreview';
import { LinkPreview } from './LinkPreview';
import { extractImages, removeImageMarkdown } from '@/utils/markdownUtils';
import { cleanupContent } from '@/utils/contentUtils';

interface NewThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedChallengeId?: string;
  onThreadCreated?: () => void;
  editingThread?: Thread | null;
}

export const NewThreadModal = ({ 
  open, 
  onOpenChange, 
  preselectedChallengeId,
  onThreadCreated,
  editingThread 
}: NewThreadModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(preselectedChallengeId || null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; name: string; path: string }>>([]);
  
  const { createThread, updateThread, challenges, isLoading: isLoadingChallenges } = useCommunityThreads();
  const { uploadFile, isUploading, deleteFile } = useSupabaseFileUpload();
  const { linkPreviews } = useLinkPreview(content);
  const isMobile = useIsMobile();

  const isEditing = !!editingThread;

  // Priority logic: show images if any exist, otherwise show link previews
  const shouldShowImages = uploadedImages.length > 0;
  const shouldShowLinkPreviews = !shouldShowImages && linkPreviews.length > 0;

  // Set form data when editing
  useEffect(() => {
    if (editingThread) {
      setTitle(editingThread.title);
      
      // Extract images from content and remove them from the text
      const images = extractImages(editingThread.content);
      const cleanedContent = cleanupContent(removeImageMarkdown(editingThread.content));
      
      setContent(cleanedContent);
      setChallengeId(editingThread.challenge_id);
      
      // Convert extracted images to uploaded images format
      const existingImages = images.map((img, index) => ({
        id: `existing-${index}`,
        url: img.url,
        name: img.alt || 'Existing image',
        path: img.url // For existing images, we use the URL as path
      }));
      setUploadedImages(existingImages);
    } else {
      // Reset form when not editing
      setTitle('');
      setContent('');
      setChallengeId(preselectedChallengeId || null);
      setUploadedImages([]);
    }
  }, [editingThread, preselectedChallengeId]);

  // Set preselected challenge when modal opens
  useEffect(() => {
    if (preselectedChallengeId && !isEditing) {
      setChallengeId(preselectedChallengeId);
    }
  }, [preselectedChallengeId, open, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
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

      if (isEditing && editingThread) {
        await updateThread.mutateAsync({ 
          id: editingThread.id,
          title, 
          content: finalContent
        });
        toast.success('Thread updated successfully');
      } else {
        await createThread.mutateAsync({ 
          title, 
          content: finalContent,
          challenge_id: challengeId || undefined,
          is_private: false
        });
        toast.success('Thread created successfully');
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setChallengeId(null);
      setUploadedImages([]);
      
      onThreadCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error with thread:', error);
      toast.error(isEditing ? 'Failed to update thread' : 'Failed to create thread');
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

  // Group challenges by category for the select dropdown
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    const category = challenge.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] w-full' : 'max-w-2xl max-h-[80vh]'} overflow-hidden flex flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {isEditing ? 'Edit Discussion' : 'Start a New Discussion'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What would you like to discuss?"
                required
                className="w-full"
              />
            </div>
            
            {!isEditing && (
              <div>
                <label htmlFor="challenge" className="block text-sm font-medium mb-1">
                  Related Challenge (optional)
                </label>
                <Select 
                  value={challengeId || "none"}
                  onValueChange={(value) => setChallengeId(value === "none" ? null : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a challenge (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific challenge</SelectItem>
                    
                    {Object.entries(groupedChallenges).map(([category, items]) => 
                      items.map(challenge => (
                        <SelectItem key={challenge.id} value={challenge.id}>
                          {(challenge.category || challenge.title).toUpperCase()}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts... (URLs will automatically show previews)"
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
                
                {/* Uploaded Images Preview - only show if shouldShowImages */}
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

            {/* Link Previews - only show if shouldShowLinkPreviews */}
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
            disabled={(isEditing ? updateThread.isPending : createThread.isPending) || isUploading}
            onClick={handleSubmit}
          >
            {isEditing 
              ? (updateThread.isPending ? 'Updating...' : 'Update Thread')
              : (createThread.isPending ? 'Creating...' : 'Create Thread')
            }
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
