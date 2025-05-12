
import { Json } from "@/integrations/supabase/types";

export interface TeamMember {
  name: string;
  profile: string;
  employmentStatus: string;
  triggerPoints: string;
}

// Helper function to ensure TeamMember objects are JSON serializable
export const serializeTeamMembers = (teamMembers: TeamMember[]): Json => {
  // Convert TeamMember objects to a plain object structure
  // This ensures they're properly serializable for Supabase
  return JSON.parse(JSON.stringify(teamMembers)) as Json;
};
