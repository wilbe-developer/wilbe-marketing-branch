
-- Create RPC function to get sprint collaborator profiles with proper access control
CREATE OR REPLACE FUNCTION public.get_sprint_collaborator_profiles(
  p_sprint_owner_id uuid,
  p_requesting_user_id uuid DEFAULT NULL
)
RETURNS TABLE(
  collaborator_id uuid,
  collaborator_email text,
  collaborator_first_name text,
  collaborator_last_name text,
  access_level text,
  collaboration_id uuid,
  created_at timestamp with time zone,
  created_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if requesting user has access to this sprint
  IF p_requesting_user_id IS NOT NULL AND 
     p_requesting_user_id != p_sprint_owner_id AND 
     NOT EXISTS (
       SELECT 1 FROM public.sprint_collaborators 
       WHERE sprint_owner_id = p_sprint_owner_id 
       AND collaborator_id = p_requesting_user_id
     ) THEN
    -- No access, return empty result
    RETURN;
  END IF;
  
  -- Return collaborator data with profile information
  RETURN QUERY
  SELECT 
    sc.collaborator_id,
    p.email as collaborator_email,
    p.first_name as collaborator_first_name,
    p.last_name as collaborator_last_name,
    sc.access_level,
    sc.id as collaboration_id,
    sc.created_at,
    sc.created_by
  FROM public.sprint_collaborators sc
  LEFT JOIN public.profiles p ON sc.collaborator_id = p.id
  WHERE sc.sprint_owner_id = p_sprint_owner_id
  ORDER BY sc.created_at DESC;
END;
$$;
