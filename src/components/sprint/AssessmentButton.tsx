
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Store the calendar URL as a constant so it can be easily updated
const CALENDAR_BOOKING_URL = "https://calendar.app.google/9XiEEbuNaNuozVXB9";

export const AssessmentButton = () => {
  const { user } = useAuth();

  if (!user) return null;

  const handleBookAssessment = () => {
    window.open(CALENDAR_BOOKING_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="gap-2"
      onClick={handleBookAssessment}
    >
      <Calendar className="h-4 w-4" />
      <span>Ready for Assessment</span>
    </Button>
  );
};
