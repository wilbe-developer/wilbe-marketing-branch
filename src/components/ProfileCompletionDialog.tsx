
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProfileCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileCompletionDialog = ({ open, onOpenChange }: ProfileCompletionDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [institutionOption, setInstitutionOption] = useState("enter");
  const [institutionValue, setInstitutionValue] = useState("");
  const [linkedInOption, setLinkedInOption] = useState("enter");
  const [linkedInValue, setLinkedInValue] = useState("");
  const [subscribeToUpdates, setSubscribeToUpdates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const { user, submitMembershipApplication } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your first and last name.",
        variant: "destructive",
      });
      return;
    }

    if (institutionOption === "enter" && !institutionValue.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your institution/company or select that you're not at one.",
        variant: "destructive",
      });
      return;
    }

    if (linkedInOption === "enter" && !linkedInValue.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your LinkedIn URL or select that you don't have LinkedIn.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Determine final values based on selections
      const finalInstitution = institutionOption === "enter" ? institutionValue.trim() : 
                              institutionOption === "not_at_institution" ? "Not at an institution/university/company" : "";
      
      const finalLinkedIn = linkedInOption === "enter" ? linkedInValue.trim() : "";

      const result = await submitMembershipApplication({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        institution: finalInstitution || undefined,
        linkedIn: finalLinkedIn || undefined,
      });
      
      if (result.success) {
        setSubmitted(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (submitted) {
      setSubmitted(false);
      setFirstName("");
      setLastName("");
      setInstitutionOption("enter");
      setInstitutionValue("");
      setLinkedInOption("enter");
      setLinkedInValue("");
      setSubscribeToUpdates(true);
    }
    onOpenChange(false);
  };

  const handleSubscribeChange = (checked: boolean | "indeterminate") => {
    setSubscribeToUpdates(checked === true);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Application Submitted!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Thank you for your application!</h3>
            <p className="text-gray-600 mb-6">
              We're reviewing your application and will notify you via email when you're approved as a member. This process is done manually to ensure the quality of our community.
            </p>
            <Button onClick={handleClose} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Your last name"
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Institution/Company *</Label>
            <Input
              value={institutionValue}
              onChange={(e) => setInstitutionValue(e.target.value)}
              placeholder="University, company, or organization"
              disabled={institutionOption !== "enter"}
            />
            <RadioGroup value={institutionOption} onValueChange={setInstitutionOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enter" id="institution-enter" />
                <Label htmlFor="institution-enter">Enter my institution/company</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not_at_institution" id="institution-na" />
                <Label htmlFor="institution-na">I'm not at an institution/university/company</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <Label>LinkedIn Profile *</Label>
            {linkedInOption === "enter" && (
              <Input
                value={linkedInValue}
                onChange={(e) => setLinkedInValue(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
              />
            )}
            <RadioGroup value={linkedInOption} onValueChange={setLinkedInOption}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enter" id="linkedin-enter" />
                <Label htmlFor="linkedin-enter">Enter LinkedIn URL</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no_linkedin" id="linkedin-none" />
                <Label htmlFor="linkedin-none">I don't have LinkedIn</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="subscribe"
              checked={subscribeToUpdates}
              onCheckedChange={handleSubscribeChange}
            />
            <Label htmlFor="subscribe" className="text-sm">
              I want to receive updates exploring alternative careers in innovation and entrepreneurship for scientists
            </Label>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionDialog;
