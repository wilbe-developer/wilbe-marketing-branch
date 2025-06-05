
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
import { Challenge } from '@/types/community';
import { Upload, X, Link as LinkIcon } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

interface NewThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedChallengeId?: string;
  onThreadCreated?: () => void;
}

export const NewThreadModal = ({ 
  open, 
  onOpenChange, 
  preselectedChallengeId,
  onThreadCreated 
}: NewThreadModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(preselectedChallengeId || null);
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; url: string; name: string }>>([]);
  const [linkPreviews, setLinkPreviews] = useState<Array<{ url: string; title?: string }>>([]);
  
  const { createThread, challenges, isLoading: isLoadingChallenges } = useCommunityThreads();
  const { uploadFile, isUploading } = useFileUpload();
  const isMobile = useIsMobile();

  // Set preselected challenge when modal opens
  useEffect(() => {
    if (preselectedChallengeId) {
      setChallengeId(preselectedChallengeId);
    }
  }, [preselectedChallengeId, open]);

  // Extract links from content and create previews
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex) || [];
    const uniqueUrls = [...new Set(urls)];
    
    setLinkPreviews(uniqueUrls.map(url => ({ url, title: url })));
  }, [content]);

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
          finalContent += `- ${img.name}\n`;
        });
      }
      
      await createThread.mutateAsync({ 
        title, 
        content: finalContent,
        challenge_id: challengeId || undefined,
        is_private: false
      });
      
      toast.success('Thread created successfully');
      
      // Reset form
      setTitle('');
      setContent('');
      setChallengeId(null);
      setUploadedImages([]);
      setLinkPreviews([]);
      
      onThreadCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
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
          id: data.fileId,
          url: data.viewLink || '',
          name: file.name
        }]);
        toast.success('Image uploaded successfully');
      },
      onError: (error) => {
        toast.error(`Upload failed: ${error.message}`);
      }
    });
  };

  const removeImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
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
      <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[90vh]' : 'max-w-2xl max-h-[80vh]'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>Start a New Discussion</DialogTitle>
        </DialogHeader>
        
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
            />
          </div>
          
          <div>
            <label htmlFor="challenge" className="block text-sm font-medium mb-1">
              Related Challenge (optional)
            </label>
            <Select 
              value={challengeId || "none"}
              onValueChange={(value) => setChallengeId(value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a challenge (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific challenge</SelectItem>
                
                {Object.entries(groupedChallenges).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                      {category}
                    </div>
                    {items.map(challenge => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
              
              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="flex items-center p-2 bg-gray-50 rounded border">
                        <span className="text-sm truncate flex-1">{image.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
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
          {linkPreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Link Previews
              </label>
              <div className="space-y-2">
                {linkPreviews.map((link, index) => (
                  <div key={index} className="flex items-center p-2 bg-blue-50 rounded border">
                    <LinkIcon size={16} className="text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm text-blue-800 truncate">{link.url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={createThread.isPending || isUploading}>
              {createThread.isPending ? 'Creating...' : 'Create Thread'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
