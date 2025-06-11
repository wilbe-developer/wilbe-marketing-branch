
-- Create pending_team_invitations table
CREATE TABLE public.pending_team_invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  sprint_owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_level text NOT NULL CHECK (access_level IN ('view', 'edit', 'manage')),
  invitation_token text NOT NULL UNIQUE,
  invited_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamp with time zone NULL,
  accepted_by uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX idx_pending_invitations_token ON public.pending_team_invitations(invitation_token);
CREATE INDEX idx_pending_invitations_email ON public.pending_team_invitations(email);
CREATE INDEX idx_pending_invitations_owner ON public.pending_team_invitations(sprint_owner_id);

-- Add RLS policies
ALTER TABLE public.pending_team_invitations ENABLE ROW LEVEL SECURITY;

-- Policy for sprint owners and managers to manage their invitations
CREATE POLICY "Sprint owners and managers can manage invitations" ON public.pending_team_invitations
  FOR ALL USING (
    sprint_owner_id = auth.uid() OR 
    invited_by = auth.uid() OR
    public.is_sprint_manager(auth.uid(), sprint_owner_id)
  );

-- Policy for reading invitations by token (for accepting invitations)
CREATE POLICY "Anyone can read invitations by token" ON public.pending_team_invitations
  FOR SELECT USING (true);

-- Function to clean up expired invitations
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.pending_team_invitations 
  WHERE expires_at < now() AND accepted_at IS NULL;
END;
$$;

-- Function to accept team invitation
CREATE OR REPLACE FUNCTION accept_team_invitation(p_token text, p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation record;
  v_result jsonb;
BEGIN
  -- Get the invitation
  SELECT * INTO v_invitation 
  FROM public.pending_team_invitations 
  WHERE invitation_token = p_token 
    AND expires_at > now() 
    AND accepted_at IS NULL;
  
  -- Check if invitation exists and is valid
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;
  
  -- Check if user is already a collaborator
  IF EXISTS (
    SELECT 1 FROM public.sprint_collaborators 
    WHERE sprint_owner_id = v_invitation.sprint_owner_id 
    AND collaborator_id = p_user_id
  ) THEN
    -- Mark invitation as accepted anyway
    UPDATE public.pending_team_invitations 
    SET accepted_at = now(), accepted_by = p_user_id 
    WHERE id = v_invitation.id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Already a team member');
  END IF;
  
  -- Add user as collaborator
  INSERT INTO public.sprint_collaborators (
    sprint_owner_id,
    collaborator_id,
    access_level,
    created_by
  ) VALUES (
    v_invitation.sprint_owner_id,
    p_user_id,
    v_invitation.access_level,
    v_invitation.invited_by
  );
  
  -- Mark invitation as accepted
  UPDATE public.pending_team_invitations 
  SET accepted_at = now(), accepted_by = p_user_id 
  WHERE id = v_invitation.id;
  
  RETURN jsonb_build_object(
    'success', true, 
    'sprint_owner_id', v_invitation.sprint_owner_id,
    'access_level', v_invitation.access_level
  );
END;
$$;
