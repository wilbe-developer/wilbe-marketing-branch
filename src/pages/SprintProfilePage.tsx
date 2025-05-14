
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AccountSettings } from "@/components/profile/AccountSettings";
import { PrivacySettings } from "@/components/profile/PrivacySettings";
import { CollaboratorsManagement } from "@/components/sprint/CollaboratorsManagement";
import { useIsMobile } from "@/hooks/use-mobile";

const SprintProfilePage = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-lg font-medium">Not Authenticated</h2>
            <p className="text-sm text-gray-500 mt-1">
              You need to be logged in to view your profile.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`${isMobile ? 'text-2xl mb-1' : 'text-3xl mb-2'} font-bold`}>Profile Settings</h1>
      <p className={`text-gray-600 ${isMobile ? 'text-sm mb-3' : 'mb-4'}`}>
        Manage your personal information and account preferences
      </p>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`mb-6 ${isMobile ? 'w-full' : ''}`}>
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>

        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="collaboration">
          <CollaboratorsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SprintProfilePage;
