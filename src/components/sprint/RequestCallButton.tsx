
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunityThreads } from "@/hooks/useCommunityThreads";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const RequestCallButton = () => {
  const { user } = useAuth();
  const { adminUsers, createThread } = useCommunityThreads();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Request Call with Admin");
  const [content, setContent] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug logging to help identify issues
  useEffect(() => {
    console.log("Admin users available:", adminUsers);
  }, [adminUsers]);

  if (!user) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !selectedAdmin) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createThread.mutateAsync({
        title,
        content,
        is_private: true,
        recipient_id: selectedAdmin
      });
      
      toast.success("Message sent successfully");
      setOpen(false);
      navigate("/community?topic=private");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Phone className="h-4 w-4" />
          <span>Request Call</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request a Call with an Admin</DialogTitle>
            <DialogDescription>
              Send a private message to request a call with one of our team members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="admin" className="text-sm font-medium">
                Select Admin
              </label>
              <Select
                value={selectedAdmin}
                onValueChange={setSelectedAdmin}
                required
              >
                <SelectTrigger id="admin">
                  <SelectValue placeholder="Select an admin" />
                </SelectTrigger>
                <SelectContent>
                  {adminUsers && adminUsers.length > 0 ? (
                    adminUsers.map((admin: any) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.first_name} {admin.last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-admins" disabled>
                      No admins available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <Input
                id="subject"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Subject of your message"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe what you'd like to discuss on the call..."
                rows={4}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
