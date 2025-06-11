
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useNewsletterSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (email: string) => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return false;
    }

    // Basic email validation
    const emailRegex = /^(?:(?:[a-zA-Z0-9_!#\$%&'\*\+/=\?\^`\{\|\}~\-]+(?:\.[a-zA-Z0-9_!#\$%&'\*\+/=\?\^`\{\|\}~\-]+)*)|(?:"(?:\\[\x00-\x7F]|[^\x0A\x0D"\\])*"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:\.]+)\]))$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setIsLoading(true);

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

      toast.success("Successfully subscribed! Don't forget to follow us on Linkedin/X.");
      return true;
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Something went wrong. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { subscribe, isLoading };
};
