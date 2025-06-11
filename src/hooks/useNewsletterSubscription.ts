
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useNewsletterSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subscribe = async (email: string) => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.toLowerCase().trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("You're already subscribed to our newsletter!");
        } else {
          console.error("Newsletter subscription error:", error);
          toast.error("Something went wrong. Please try again.");
        }
        return false;
      }

      setIsSuccess(true);
      toast.success("Successfully subscribed! Thank you for joining our newsletter.");
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
      
      return true;
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSuccess = () => setIsSuccess(false);

  return { subscribe, isLoading, isSuccess, resetSuccess };
};
