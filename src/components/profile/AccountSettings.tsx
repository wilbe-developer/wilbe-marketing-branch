
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export const AccountSettings = () => {
  const [resetEmail, setResetEmail] = useState("");
  const { resetPassword, loading, user } = useAuth();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = resetEmail || user?.email || "";
    
    if (!emailToUse || !emailToUse.includes('@')) {
      return;
    }
    
    await resetPassword(emailToUse);
    setResetEmail("");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Password Management</CardTitle>
          <CardDescription>
            Set up or reset your password for this account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resetEmail">Email Address</Label>
            <Input
              id="resetEmail"
              type="email"
              placeholder={user?.email || "Enter your email"}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <p className="text-sm text-gray-600">
              Leave blank to use your account email ({user?.email})
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePasswordReset} disabled={loading}>
            {loading ? "Sending reset link..." : "Send Password Reset Email"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive email updates about new content and events
                </p>
              </div>
              <Button variant="outline">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Platform Updates</h3>
                <p className="text-sm text-gray-600">
                  Get notified about platform features and improvements
                </p>
              </div>
              <Button variant="outline">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Community Notifications</h3>
                <p className="text-sm text-gray-600">
                  Receive updates about member activities and discussions
                </p>
              </div>
              <Button variant="outline">Disabled</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
