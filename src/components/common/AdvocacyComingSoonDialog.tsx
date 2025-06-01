
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface AdvocacyComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'support' | 'share';
}

export default function AdvocacyComingSoonDialog({ isOpen, onClose, type }: AdvocacyComingSoonDialogProps) {
  const content = type === 'support' 
    ? {
        title: "Ready to Show Support? ✊",
        message: "We're putting the finishing touches on something special for our most passionate advocates...",
        button: "Count Me In! 🔥"
      }
    : {
        title: "Want to Spread the Word? ✍️",
        message: "Big things are coming for our community champions. Stay tuned for something that'll make sharing irresistible...",
        button: "I'm Ready! 📢"
      };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield className="h-6 w-6 text-orange-600" />
            {content.title}
          </DialogTitle>
          <DialogDescription className="text-base mt-4 text-center">
            {content.message}
            <br />
            <br />
            The revolution needs patience... but not for much longer. 😎
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onClose}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {content.button}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
