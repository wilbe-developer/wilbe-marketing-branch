
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Upload, X, File } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface IssueReportFormProps {
  children: React.ReactNode;
}

export default function IssueReportForm({ children }: IssueReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    contactEmail: "",
    issueDescription: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAttachment = async (file: File, reportId: string) => {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${reportId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('issue-reports')
        .upload(fileName, file);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw uploadError;
      }

      // Save attachment metadata to database
      const { error: attachmentError } = await supabase
        .from('issue_report_attachments')
        .insert({
          report_id: reportId,
          file_name: file.name,
          file_path: uploadData.path,
          file_size: file.size,
          content_type: file.type
        });

      if (attachmentError) {
        console.error('Attachment metadata error:', attachmentError);
        throw attachmentError;
      }

      return uploadData.path;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contactEmail || !formData.issueDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create the issue report
      const { data: reportData, error: reportError } = await supabase
        .from('issue_reports')
        .insert({
          contact_email: formData.contactEmail,
          issue_description: formData.issueDescription,
          submitted_by_user_id: user?.id || null,
          status: 'pending',
          priority: 'medium'
        })
        .select()
        .single();

      if (reportError) {
        console.error('Report creation error:', reportError);
        throw reportError;
      }

      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadPromises = attachments.map(file => 
          uploadAttachment(file, reportData.id)
        );
        
        try {
          await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error('Some attachments failed to upload:', uploadError);
          // Still show success since the report was created
          toast.warning("Report submitted but some attachments failed to upload. You can try submitting them again.");
        }
      }
      
      toast.success("Your report has been submitted successfully. We'll review it and get back to you.");
      
      // Reset form
      setFormData({ contactEmail: "", issueDescription: "" });
      setAttachments([]);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Report an Issue
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              Your Contact Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="your.email@example.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              required
            />
            <p className="text-sm text-gray-600">
              We'll use this email to follow up on your report
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDescription">
              Issue Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="issueDescription"
              placeholder="Please describe the issue you're experiencing or reporting..."
              value={formData.issueDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, issueDescription: e.target.value }))}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments (optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload screenshots or documents
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isSubmitting}
                >
                  Choose Files
                </Button>
              </div>
            </div>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Attached Files:</Label>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
