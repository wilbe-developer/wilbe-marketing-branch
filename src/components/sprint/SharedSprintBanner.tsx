
import { useSprintContext } from "@/hooks/useSprintContext";
import { useGuestUser } from "@/hooks/useGuestUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const SharedSprintBanner = () => {
  const { isSharedSprint, sprintOwnerName } = useSprintContext();
  const { isGuestUser } = useGuestUser();

  if (!isSharedSprint || !sprintOwnerName) {
    return null;
  }

  // Enhanced banner for guest users
  if (isGuestUser) {
    return (
      <Alert variant="default" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-4">
        <Users className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 flex items-center justify-between">
          <span>Viewing {sprintOwnerName}'s BSF</span>
          <Button asChild size="sm" className="ml-4">
            <Link to="/sprint/profile">
              <Plus className="h-3 w-3 mr-1" />
              Start Your Own
            </Link>
          </Button>
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          You're viewing a BSF shared with you. Any changes you make will be visible to the BSF owner.
        </AlertDescription>
      </Alert>
    );
  }

  // Regular banner for users with their own sprint profile
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-200 mb-4">
      <Users className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Shared BSF</AlertTitle>
      <AlertDescription className="text-blue-700">
        You're viewing a BSF shared by {sprintOwnerName}. Any changes you make will be visible to the BSF owner.
      </AlertDescription>
    </Alert>
  );
};
