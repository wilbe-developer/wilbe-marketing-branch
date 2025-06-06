
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfileActions } from "@/hooks/auth/useProfileActions";

interface User {
  id: string;
  email?: string;
}

interface ProfileFormProps {
  user: User;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    institution: "",
    location: "",
    bio: "",
    about: "",
    expertise: "",
    linked_in: "",
    twitter_handle: "",
  });

  const { updateProfile } = useProfileActions({
    user: user as any,
    setUser: () => {}, // We don't need to update user state here
    setLoading: setIsLoading,
    toast
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error("Error loading profile:", error);
          return;
        }

        if (data) {
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            institution: data.institution || "",
            location: data.location || "",
            bio: data.bio || "",
            about: data.about || "",
            expertise: data.expertise || "",
            linked_in: data.linked_in || "",
            twitter_handle: data.twitter_handle || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to update your profile",
        variant: "destructive"
      });
      return;
    }

    // Convert form data to UserProfile format
    const profileData = {
      firstName: formData.first_name,
      lastName: formData.last_name,
      institution: formData.institution,
      location: formData.location,
      bio: formData.bio,
      about: formData.about,
      expertise: formData.expertise,
      linkedIn: formData.linked_in,
      twitterHandle: formData.twitter_handle,
    };

    await updateProfile(profileData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isMobile ? "text-lg" : "text-xl"}>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className={isMobile ? "text-base" : ""}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className={isMobile ? "text-base" : ""}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="institution">Institution/Organization</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className={isMobile ? "text-base" : ""}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={isMobile ? "text-base" : ""}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="A brief bio about yourself"
              className={isMobile ? "text-base min-h-[100px]" : ""}
            />
          </div>

          <div>
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              placeholder="Tell us more about your background and interests"
              className={isMobile ? "text-base min-h-[100px]" : ""}
            />
          </div>

          <div>
            <Label htmlFor="expertise">Expertise</Label>
            <Textarea
              id="expertise"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              placeholder="Your areas of expertise and skills"
              className={isMobile ? "text-base min-h-[100px]" : ""}
            />
          </div>

          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            <div>
              <Label htmlFor="linked_in">LinkedIn URL</Label>
              <Input
                id="linked_in"
                type="url"
                value={formData.linked_in}
                onChange={(e) => setFormData({ ...formData, linked_in: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
                className={isMobile ? "text-base" : ""}
              />
            </div>
            <div>
              <Label htmlFor="twitter_handle">Twitter Handle</Label>
              <Input
                id="twitter_handle"
                value={formData.twitter_handle}
                onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                placeholder="@yourusername"
                className={isMobile ? "text-base" : ""}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
