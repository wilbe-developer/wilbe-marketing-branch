
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ImStuckButton = ({ taskId }: { taskId?: string }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to community FAQs with optional task context
    const url = taskId 
      ? `/community?topic=faqs&taskId=${taskId}`
      : `/community?topic=faqs`;
    navigate(url);
  };

  return (
    <Button size="sm" variant="outline" className="gap-2" onClick={handleClick}>
      <HelpCircle className="h-4 w-4" />
      <span>I'm Stuck</span>
    </Button>
  );
};
