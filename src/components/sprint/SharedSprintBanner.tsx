
import { useSprintContext } from "@/hooks/useSprintContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users } from "lucide-react";

export const SharedSprintBanner = () => {
  const { isSharedSprint, sprintOwnerName } = useSprintContext();

  if (!isSharedSprint || !sprintOwnerName) {
    return null;
  }

  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
      <Users className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Shared Sprint</AlertTitle>
      <AlertDescription className="text-blue-700">
        You're viewing a sprint shared by {sprintOwnerName}. Any changes you make will be visible to the sprint owner.
      </AlertDescription>
    </Alert>
  );
};
