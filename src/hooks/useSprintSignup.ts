
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { SprintSignupAnswers } from "@/types/sprint-signup";
import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/lib/constants";
import { windows } from "@/components/sprint/SprintSignupWindows";
import { useSprintProfile } from "./useSprintProfile";
import { toast } from "sonner";
import { sendSprintWaitingEmail } from "@/services/emailService";
import { useAppSettings } from "./useAppSettings";

export const useSprintSignup = () => {
  const { user, isAuthenticated, loading: authLoading, signUp, signIn } = useAuth();
  const { isDashboardActive, isLoading: settingsLoading } = useAppSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUserSprintData } = useSprintProfile();
  
  const [currentWindow, setCurrentWindow] = useState(0);
  const [answers, setAnswers] = useState<SprintSignupAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [hasSprintProfile, setHasSprintProfile] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Extract UTM parameters from URL
  const urlParams = new URLSearchParams(location.search);
  const utmParams = {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content')
  };

  useEffect(() => {
    // Log UTM parameters for debugging
    const filteredParams = Object.fromEntries(
      Object.entries(utmParams).filter(([_, v]) => v !== null)
    );
    
    if (Object.keys(filteredParams).length > 0) {
      console.log("UTM parameters detected:", filteredParams);
    }
  }, [location.search]);

  // Check if user already has a sprint profile
  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!authLoading && isAuthenticated && user) {
        try {
          const { data: hasProfile, error } = await supabase
            .rpc('has_completed_sprint_onboarding', {
              p_user_id: user.id
            });

          if (error) {
            console.error('Error checking sprint profile:', error);
            return;
          }

          setHasSprintProfile(hasProfile);
        } catch (error) {
          console.error('Error checking profile:', error);
        }
      }
    };

    checkExistingProfile();
  }, [isAuthenticated, authLoading, user]);
  
  // Handle input changes
  const handleChange = (name: string, value: any) => {
    setAnswers(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };
  
  // Toggle multi-select options
  const toggleMultiSelect = (name: string, value: string) => {
    setAnswers(prev => {
      const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [name]: [...currentValues, value] };
      }
    });
  };
  
  // Navigate to next window
  const goToNextWindow = async () => {
    // If we're on the first window and email is entered, check if it exists
    if (currentWindow === 0 && answers.email && !isAuthenticated) {
      await checkEmailExists(answers.email);
    } else {
      setCurrentWindow(prev => Math.min(prev + 1, windows.length));
    }
  };
  
  // Navigate to previous window
  const goToPreviousWindow = () => {
    setCurrentWindow(prev => Math.max(prev - 1, 0));
  };

  // Check if email exists in auth.users
  const checkEmailExists = async (email: string) => {
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error checking email:', error);
        setEmailExists(false);
      } else {
        setEmailExists(!!data);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setEmailExists(false);
    } finally {
      setIsCheckingEmail(false);
    }
    
    if (!emailExists) {
      setCurrentWindow(prev => Math.min(prev + 1, windows.length));
    }
  };

  // Handle magic link sign in
  const handleSendMagicLink = async (email: string) => {
    if (!email) return;
    
    try {
      setIsCheckingEmail(true);
      const { error } = await signIn(email);
      
      if (error) {
        console.error('Error sending magic link:', error);
        toast.error('Failed to send login link. Please try again.');
      } else {
        toast.success('Login link sent! Please check your email inbox.');
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error('Failed to send login link. Please try again.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Sign up silently and create sprint profile
  const silentSignup = async (formData: SprintSignupAnswers, utmParameters = {}) => {
    setIsSubmitting(true);
    
    try {
      // If not authenticated, sign up
      if (!isAuthenticated) {
        // No password for magic link signup
        await signUp(formData.email || '', '', formData.name || '');
      }
      
      // Save answers to database - includes UTM parameters
      await updateUserSprintData(
        user?.id || null, 
        formData, 
        uploadedFile,
        // Merge UTM parameters from the URL and any passed directly
        { ...utmParams, ...utmParameters }
      );
      
      // Send sprint waiting email - includes UTM parameters
      await sendSprintWaitingEmail(
        formData.email || '', 
        formData.name || '', 
        formData.linkedin || ''
      );
      
      // Navigate to appropriate page based on feature flag
      navigate(isDashboardActive ? PATHS.SPRINT_DASHBOARD : PATHS.SPRINT_WAITING);
      
      toast.success('Your BSF profile has been created!');
    } catch (error) {
      console.error('Error in signup process:', error);
      toast.error('There was an error creating your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentWindow,
    answers,
    isSubmitting,
    uploadedFile,
    hasSprintProfile,
    isCheckingEmail,
    emailExists,
    handleChange,
    toggleMultiSelect,
    handleFileUpload,
    goToNextWindow,
    goToPreviousWindow,
    silentSignup,
    handleSendMagicLink
  };
};
