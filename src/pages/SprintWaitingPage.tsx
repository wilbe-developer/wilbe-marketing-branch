
import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const SprintWaitingPage = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Log UTM parameters for the current user profile if they exist
    const fetchUtmParams = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('sprint_profiles')
            .select('utm_source, utm_medium, utm_campaign, utm_term, utm_content')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (data && !error) {
            const utmData = {
              utm_source: data.utm_source,
              utm_medium: data.utm_medium,
              utm_campaign: data.utm_campaign,
              utm_term: data.utm_term,
              utm_content: data.utm_content
            };
            
            // Filter out null values
            const filteredUtmData = Object.fromEntries(
              Object.entries(utmData).filter(([_, v]) => v !== null)
            );
            
            if (Object.keys(filteredUtmData).length > 0) {
              console.log('UTM parameters for this user:', filteredUtmData);
            }
          }
        } catch (err) {
          console.error('Error fetching UTM data:', err);
        }
      }
    };
    
    fetchUtmParams();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1F2C] mb-4">
              Thank You for Signing Up!
            </h1>
            <p className="text-xl text-[#403E43] mb-4">
              Your BSF profile has been saved successfully.
            </p>
            <p className="text-[#403E43]">
              We're preparing to launch the full BSF experience soon. We'll notify you at{" "}
              <span className="font-semibold">{user?.email}</span> when it's ready.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">What happens next?</h2>
            <p className="text-blue-700">
              Our team is putting the finishing touches on the BSF experience. 
              You'll receive an email when the platform is open, and you'll be able to 
              access your dashboard with all your saved information.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-600">
        Putting Scientists First since 2020.
      </footer>
    </div>
  );
};

export default SprintWaitingPage;
