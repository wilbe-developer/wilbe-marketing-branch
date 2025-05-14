
import { supabase } from "@/integrations/supabase/client";

// This hook is kept for backward compatibility, but its functionality
// has been moved to the global template-based task system.
// Tasks are now managed centrally by admins.
export const useSprintTasksManager = () => {
  // This stub function is kept for backward compatibility
  // New tasks should be created through the admin interface
  const createSprintTasks = async () => {
    console.warn('createSprintTasks is deprecated. Tasks are now global templates managed by admins.');
  };

  return { createSprintTasks };
};
