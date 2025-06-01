
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Mail } from "lucide-react";

interface ApplicationPendingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationPendingDialog = ({ open, onOpenChange }: ApplicationPendingDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Application Under Review</DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">We're reviewing your application</h3>
          <p className="text-gray-600 mb-4">
            Your application has been submitted successfully. Our team is currently reviewing it and will notify you via email once you're approved as a member.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <Mail className="h-4 w-4" />
            <span>You'll receive an email notification when approved</span>
          </div>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationPendingDialog;
