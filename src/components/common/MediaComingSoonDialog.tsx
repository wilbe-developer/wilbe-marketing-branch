
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Film } from "lucide-react"

interface MediaComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaComingSoonDialog({ isOpen, onClose }: MediaComingSoonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Film className="h-6 w-6 text-blue-600" />
            Shh... 🤫
          </DialogTitle>
          <DialogDescription className="text-base mt-4 text-center">
            Something epic is brewing behind the scenes. 
            <br />
            <br />
            We can't say what yet, but trust us... it's going to be worth the wait. 😉
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700"
          >
            I'll Keep Waiting! 👀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
