import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { Thread, ThreadComment } from "@/types/community";

export const useCommunityThreads = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get admin users directly from unified_profiles where role = 'admin'
  const { data: adminUsers = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      console.log("Fetching admin users for Request Call...");
      
      const { data, error } = await supabase
        .from("unified_profiles")
        .select("user_id, first_name, last_name, email, linked_in, institution, avatar")
        .eq("role", "admin");

      if (error) {
        console.error("Error fetching admin users:", error);
        throw error;
      }

      console.log("Admin users fetched directly from unified_profiles:", data);
      return data || [];
    },
  });

  const { data: threads = [], isLoading: isLoadingThreads } = useQuery({
    queryKey: ["communityThreads", { isPrivate: false }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_threads")
        .select(`
          *,
          author_profile:profiles!discussion_threads_author_id_fkey(first_name, last_name, avatar),
          author_role:user_roles!user_roles_user_id_fkey(role),
          comment_count:thread_comments(count),
          challenge_name:discussion_challenges(name)
        `)
        .eq("is_private", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Thread[];
    },
  });

  const { data: privateThreads = [], isLoading: isLoadingPrivateThreads } = useQuery({
    queryKey: ["privateThreads", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("discussion_threads")
        .select(`
          *,
          author_profile:profiles!discussion_threads_author_id_fkey(first_name, last_name, avatar),
          author_role:user_roles!user_roles_user_id_fkey(role),
          comment_count:thread_comments(count),
          recipient_profile:profiles!discussion_threads_recipient_id_fkey(first_name, last_name, avatar)
        `)
        .eq("is_private", true)
        .or(`author_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Thread[];
    },
    enabled: !!user?.id,
  });

  const createThread = useMutation({
    mutationFn: async (newThread: {
      title: string;
      content: string;
      challenge_id?: string;
      is_private?: boolean;
      recipient_id?: string;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("discussion_threads")
        .insert({
          title: newThread.title,
          content: newThread.content,
          author_id: user.id,
          challenge_id: newThread.challenge_id,
          is_private: newThread.is_private || false,
          recipient_id: newThread.recipient_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityThreads"] });
      queryClient.invalidateQueries({ queryKey: ["privateThreads"] });
    },
  });

  const updateThread = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { data, error } = await supabase
        .from("discussion_threads")
        .update({ title, content })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityThreads"] });
      queryClient.invalidateQueries({ queryKey: ["privateThreads"] });
    },
  });

  const deleteThread = useMutation({
    mutationFn: async (threadId: string) => {
      const { error } = await supabase
        .from("discussion_threads")
        .delete()
        .eq("id", threadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communityThreads"] });
      queryClient.invalidateQueries({ queryKey: ["privateThreads"] });
    },
  });

  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discussion_challenges")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return {
    threads,
    privateThreads,
    adminUsers,
    challenges,
    faqs,
    isLoading: isLoadingThreads || isLoadingPrivateThreads || isLoadingAdmins,
    createThread,
    updateThread,
    deleteThread,
  };
};
