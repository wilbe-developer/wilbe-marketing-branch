
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { PATHS } from "@/lib/constants";
import Logo from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const PasswordResetPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  
  const { updatePassword, loading, isRecoveryMode } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  console.log("PasswordResetPage - Recovery mode:", isRecoveryMode);
  console.log("PasswordResetPage - URL params:", Object.fromEntries(searchParams.entries()));

  // Check if the user arrived via a password reset link or is in recovery mode
  useEffect(() => {
    const checkRecoveryStatus = async () => {
      const type = searchParams.get("type");
      const accessToken = searchParams.get("access_token");
      
      // Check URL parameters first
      if (type === "recovery" && accessToken) {
        console.log("Recovery parameters found in URL");
        setIsDialogOpen(true);
        return;
      }
      
      // If we're in recovery mode from auth context, show the dialog
      if (isRecoveryMode) {
        console.log("In recovery mode from context, opening dialog");
        setIsDialogOpen(true);
        return;
      }
      
      // Check hash fragment for recovery token
      if (window.location.hash) {
        console.log("Hash fragment found:", window.location.hash);
        // The hash might contain the recovery token
        const { data, error } = await supabase.auth.getSession();
        if (data?.session) {
          console.log("Active session found after hash fragment");
          setIsDialogOpen(true);
        }
      }
    };
    
    checkRecoveryStatus();
  }, [searchParams, isRecoveryMode]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updatePassword(password);
      setIsDialogOpen(false);
      
      // Redirect to home page
      navigate(PATHS.HOME);
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Your New Password</DialogTitle>
            <DialogDescription>
              Please create a new password for your account.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Set New Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Password Reset</CardTitle>
          <CardDescription>
            Please follow the instructions to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Please check your email for a password reset link.</p>
          <p className="mt-4">After clicking the link, you'll be able to set a new password.</p>
          
          <div className="mt-8">
            <Button variant="outline" onClick={() => navigate(PATHS.LOGIN)}>
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetPage;
