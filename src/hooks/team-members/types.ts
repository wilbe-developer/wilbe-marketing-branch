
import { Json } from "@/integrations/supabase/types";

// Standardized TeamMember interface using snake_case field names to match database structure
export interface TeamMember {
  id?: string;
  name: string;
  profile_description: string;
  employment_status: string;
  trigger_points?: string;
}

// Helper function to ensure TeamMember objects are JSON serializable
export const serializeTeamMembers = (teamMembers: TeamMember[]): Json => {
  // Convert TeamMember objects to a plain object structure
  // This ensures they're properly serializable for Supabase
  return JSON.parse(JSON.stringify(teamMembers)) as Json;
};
