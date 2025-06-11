
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
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
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
  }, [isAuthenticated, user, invitation, success, isAccepting]);

  const fetchInvitation = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_team_invitations')
        .select(`
          *,
          owner:sprint_owner_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('invitation_token', token)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Invitation not found or has expired');
        } else {
          setError('Failed to load invitation');
        }
        return;
      }

      setInvitation(data);
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Failed to load invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user?.id || !token) return;

    setIsAccepting(true);
    try {
      const { data, error } = await supabase.rpc('accept_team_invitation', {
        p_token: token,
        p_user_id: user.id
      });

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

  if (!isAuthenticated) {
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
                  From: {invitation.owner?.first_name} {invitation.owner?.last_name}
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
                From: {invitation.owner?.first_name} {invitation.owner?.last_name}
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
