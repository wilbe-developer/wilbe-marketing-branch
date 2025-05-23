
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useFAQs, FAQ } from "@/hooks/useFAQs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const ImStuckButton = ({ taskId }: { taskId?: string }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { faqsByCategory, isLoading } = useFAQs(taskId);

  const handlePostQuestion = () => {
    if (taskId) {
      navigate(`/community/new?challenge=${taskId}`);
    } else {
      navigate("/community/new");
    }
    setOpen(false);
  };

  const handleRequestCall = () => {
    // Close this dialog first
    setOpen(false);
    
    // Open the RequestCall dialog by triggering a click on the RequestCall button
    // For simplicity, we'll just navigate to community with private filter
    navigate("/community?topic=private");
    
    // Show a toast message
    toast.info("Use the 'Request Call' button to schedule a call");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          <span>I'm Stuck</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>
            Here are some frequently asked questions that might help you.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="py-4">
            {Object.entries(faqsByCategory).length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(faqsByCategory).map(([category, faqs]) => (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="text-lg font-medium">
                      {category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {faqs.map((faq: FAQ) => (
                          <div key={faq.id} className="border-b pb-4 last:border-b-0">
                            <h4 className="font-semibold mb-2">{faq.question}</h4>
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No FAQs available at the moment.
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handlePostQuestion} variant="outline" className="w-full sm:w-auto">
            Post a Question
          </Button>
          <Button onClick={handleRequestCall} className="w-full sm:w-auto">
            Request a Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
