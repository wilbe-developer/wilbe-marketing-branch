
import { Button } from "@/components/ui/button";
import { useSprintContext } from "@/hooks/useSprintContext";
import { useSharedSprints } from "@/hooks/useSharedSprints";
import { useAuth } from "@/hooks/useAuth";
import { Users, ChevronRight, ArrowLeft } from "lucide-react";

export const SharedSprintsSelector = () => {
  const { user } = useAuth();
  const { sharedSprints, isLoading } = useSharedSprints(user?.id);
  const { switchToSharedSprint, isSharedSprint, switchToOwnSprint } = useSprintContext();

  if (isLoading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!sharedSprints.length) {
    return null;
  }

  return (
    <div className="mb-6">
      {isSharedSprint ? (
        <Button 
          variant="outline" 
          className="mb-4" 
          onClick={switchToOwnSprint}
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to my BSF
        </Button>
      ) : (
        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Shared BSF
          </h2>
          <div className="space-y-2">
            {sharedSprints.map(sprint => (
              <Button
                key={sprint.owner_id}
                variant="outline"
                className="w-full justify-between"
                onClick={() => switchToSharedSprint(sprint.owner_id, sprint.owner_name)}
              >
                <span>{sprint.owner_name}'s BSF</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
