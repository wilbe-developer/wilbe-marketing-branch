
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileCompletionModal = ({ isOpen, onClose }: ProfileCompletionModalProps) => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    linkedIn: user?.linkedIn || "",
    institution: user?.institution || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim()) {
      toast.error("Please enter your first name");
      return;
    }

    setLoading(true);
    
    try {
      // Update the user profile
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        linkedIn: formData.linkedIn,
        institution: formData.institution
      });

      toast.success("Profile updated! We'll review your application and approve you soon.");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Help us verify your account by completing your profile. We'll approve you soon!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name *
              </label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter your first name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter your last name"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="linkedIn" className="text-sm font-medium">
                LinkedIn Profile (optional)
              </label>
              <Input
                id="linkedIn"
                value={formData.linkedIn}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="institution" className="text-sm font-medium">
                Institution (optional)
              </label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                placeholder="Your university or company"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating Profile..." : "Complete Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
