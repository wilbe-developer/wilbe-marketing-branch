
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Film, Calendar, Users, Play } from "lucide-react"

interface MediaComingSoonDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaComingSoonDialog({ isOpen, onClose }: MediaComingSoonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Film className="h-6 w-6 text-blue-600" />
            Media Hub Coming Soon!
          </DialogTitle>
          <DialogDescription className="text-base mt-4">
            We're building something amazing for you...
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-3">
            <Play className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Video Content</h4>
              <p className="text-sm text-gray-600">Exclusive interviews, tutorials, and insights from scientist entrepreneurs</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Community Stories</h4>
              <p className="text-sm text-gray-600">Success stories and journeys from our scientist community</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Live Events</h4>
              <p className="text-sm text-gray-600">Webinars, workshops, and networking sessions</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Can't Wait!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
