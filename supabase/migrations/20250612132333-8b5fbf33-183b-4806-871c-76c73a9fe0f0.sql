
-- Update the unified_profiles view to correctly join with user_roles
DROP VIEW IF EXISTS public.unified_profiles;

CREATE VIEW public.unified_profiles AS
SELECT 
  COALESCE(p.id, sp.user_id) AS user_id,
  COALESCE(p.first_name, SPLIT_PART(sp.name, ' ', 1)) AS first_name,
  COALESCE(p.last_name, SPLIT_PART(sp.name, ' ', 2)) AS last_name,
  COALESCE(p.email, sp.email) AS email,
  COALESCE(p.linked_in, sp.linkedin_url) AS linked_in,
  COALESCE(p.institution, sp.current_job) AS institution,
  p.location,
  -- Use role from user_roles table instead of profiles.role
  ur.role::text AS role,
  p.bio,
  p.about,
  p.expertise,
  p.avatar,
  p.approved,
  COALESCE(p.created_at, sp.created_at) AS created_at,
  p.activity_status,
  p.status,
  p.twitter_handle,
  p.last_login_date,
  (sp.user_id IS NOT NULL) AS has_sprint_profile,
  (p.id IS NOT NULL) AS has_profile
FROM profiles p
FULL OUTER JOIN sprint_profiles sp ON p.id = sp.user_id
-- Join with user_roles to get the correct role
LEFT JOIN user_roles ur ON COALESCE(p.id, sp.user_id) = ur.user_id;
