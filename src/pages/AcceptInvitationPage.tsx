
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle, XCircle, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '@/lib/constants';

const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [invitation, setInvitation] = useState<any>(null);
  const [inviterProfile, setInviterProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token) {
      console.error('No invitation token provided');
      setError('Invalid invitation link');
      setIsLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  useEffect(() => {
    // If user is authenticated and we have a valid invitation, auto-accept
    if (isAuthenticated && user && invitation && !success && !isAccepting) {
      handleAcceptInvitation();
    }
    // If user is not authenticated but we have email, try silent signup
    else if (!isAuthenticated && !authLoading && invitation && email && !isSigningUp && !success) {
      handleSilentSignup();
    }
  }, [isAuthenticated, user, invitation, success, isAccepting, authLoading, email, isSigningUp]);

  const fetchInvitation = async () => {
    try {
      console.log('Fetching invitation for token:', token);
      
      // First, get the invitation details
      const { data: invitationData, error: invitationError } = await supabase
        .from('pending_team_invitations')
        .select('*')
        .eq('invitation_token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      console.log('Invitation query result:', { data: invitationData, error: invitationError });

      if (invitationError) {
        console.error('Database error fetching invitation:', invitationError);
        if (invitationError.code === 'PGRST116') {
          setError('Invitation not found or has expired');
        } else {
          setError('Failed to load invitation');
        }
        return;
      }

      console.log('Successfully loaded invitation:', invitationData);
      setInvitation(invitationData);

      // Then, get the inviter's sprint profile
      if (invitationData.sprint_owner_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('sprint_profiles')
          .select('name, email')
          .eq('user_id', invitationData.sprint_owner_id)
          .single();

        console.log('Sprint profile query result:', { data: profileData, error: profileError });

        if (profileData) {
          setInviterProfile(profileData);
        } else {
          console.warn('No sprint profile found for inviter');
        }
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Failed to load invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSilentSignup = async () => {
    if (!email || !token) return;

    setIsSigningUp(true);
    try {
      console.log('Attempting silent signup for:', email);
      
      // Attempt to sign up the user with the email from the invitation
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: crypto.randomUUID(), // Generate a random password they'll never use
        options: {
          emailRedirectTo: `${window.location.origin}${PATHS.SPRINT_DASHBOARD}`,
          data: {
            skipEmailConfirmation: true
          }
        }
      });

      if (signUpError) {
        console.error('Silent signup error:', signUpError);
        // If user already exists, show manual login options
        if (signUpError.message?.includes('already registered')) {
          setError('An account with this email already exists. Please sign in to accept the invitation.');
          setIsSigningUp(false);
          return;
        }
        throw signUpError;
      }

      console.log('Silent signup successful:', signUpData);
      // The auth state change will trigger invitation acceptance
      
    } catch (error: any) {
      console.error('Error during silent signup:', error);
      setError('Failed to create account. Please try signing in manually.');
      setIsSigningUp(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user?.id || !token) return;

    setIsAccepting(true);
    try {
      console.log('Accepting invitation for user:', user.id, 'with token:', token);
      
      const { data, error } = await supabase.rpc('accept_team_invitation', {
        p_token: token,
        p_user_id: user.id
      });

      console.log('Accept invitation result:', { data, error });

      if (error) throw error;

      // Parse the returned JSONB data
      const result = typeof data === 'string' ? JSON.parse(data) : data;

      if (result?.success) {
        setSuccess(true);
        toast.success('Successfully joined the team!');
        
        // Redirect to the shared sprint dashboard after a short delay
        setTimeout(() => {
          navigate(PATHS.SPRINT_DASHBOARD);
        }, 2000);
      } else {
        setError(result?.error || 'Failed to accept invitation');
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setError(error.message || 'Failed to accept invitation');
      toast.error('Failed to accept invitation');
    } finally {
      setIsAccepting(false);
      setIsSigningUp(false);
    }
  };

  const getAccessLevelText = (level: string) => {
    switch (level) {
      case 'view':
        return 'View Only';
      case 'edit':
        return 'Can Edit';
      case 'manage':
        return 'Can Manage';
      default:
        return 'Custom Access';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {error.includes('already exists') && (
              <div className="space-y-2 mb-4">
                <Button 
                  onClick={() => navigate(`${PATHS.LOGIN}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                  className="w-full"
                >
                  Sign In
                </Button>
              </div>
            )}
            <Button onClick={() => navigate(PATHS.HOME)} variant="outline">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <CardTitle>Welcome to the Team!</CardTitle>
            <CardDescription>
              You've successfully joined the BSF team. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isSigningUp || isAccepting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-2" />
            <CardTitle>Setting Up Your Access</CardTitle>
            <CardDescription>
              {isSigningUp ? 'Creating your account...' : 'Accepting invitation...'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated && !email) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <CardTitle>BSF Team Invitation</CardTitle>
            <CardDescription>
              You've been invited to join a BSF team. Please sign in or create an account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitation && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">Invitation Details:</h3>
                <p className="text-sm text-gray-600 mt-1">
                  From: {inviterProfile?.name || 'BSF Team Member'}
                </p>
                <p className="text-sm text-gray-600">
                  Access Level: {getAccessLevelText(invitation.access_level)}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Button 
                onClick={() => navigate(`${PATHS.LOGIN}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                className="w-full"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate(`${PATHS.REGISTER}?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
                variant="outline" 
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
          <CardTitle>BSF Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join a BSF team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Invitation Details:</h3>
              <p className="text-sm text-gray-600 mt-1">
                From: {inviterProfile?.name || 'BSF Team Member'}
              </p>
              <p className="text-sm text-gray-600">
                Access Level: {getAccessLevelText(invitation.access_level)}
              </p>
            </div>
          )}
          <Button 
            onClick={handleAcceptInvitation}
            disabled={isAccepting}
            className="w-full"
          >
            {isAccepting ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Accepting...
              </>
            ) : (
              'Accept Invitation'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitationPage;
