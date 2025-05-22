
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WaitlistSignup, SprintProfile } from "./types";

// Fetch all waitlist signups
export const fetchWaitlistSignups = async (): Promise<WaitlistSignup[]> => {
  try {
    const { data, error } = await supabase
      .from("waitlist_signups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    if (data) {
      return data.map(item => ({
        ...item,
        source: 'waitlist' as const
      })) as WaitlistSignup[];
    }
    
    return [];
  } catch (error: any) {
    console.error("Error fetching waitlist signups:", error);
    toast.error("Failed to load waitlist data");
    throw error;
  }
};

// Fetch all sprint profiles
export const fetchSprintProfiles = async (): Promise<SprintProfile[]> => {
  try {
    const { data, error } = await supabase
      .from("sprint_profiles")
      .select("id, user_id, name, email, created_at, utm_source, utm_medium, utm_campaign, utm_term, utm_content")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    if (data) {
      return data.map(item => ({
        ...item,
        source: 'sprint' as const
      })) as SprintProfile[];
    }
    
    return [];
  } catch (error: any) {
    console.error("Error fetching sprint profiles:", error);
    toast.error("Failed to load sprint profile data");
    throw error;
  }
};
