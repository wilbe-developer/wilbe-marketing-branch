import { supabase } from "@/integrations/supabase/client";
import { PATHS } from "@/lib/constants";

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    // Build the sprint URL with the current origin
    const sprintUrl = `${window.location.origin}/sprint-dashboard`;
    
    console.log(`Sending welcome email to ${email} (${name}) with sprint URL: ${sprintUrl}`);
    
    // Call the Supabase Edge Function that sends welcome emails
    const { data, error } = await supabase.functions.invoke('send-welcome-email', {
      body: { 
        to: email, 
        name: name, 
        sprintUrl: sprintUrl 
      }
    });
    
    if (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
    
    console.log('Welcome email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception sending welcome email:', error);
    return false;
  }
};

export const sendSprintWaitingEmail = async (email: string, name: string, linkedin: string = ''): Promise<boolean> => {
  try {
    console.log(`Sending sprint waiting confirmation to ${email} (${name})`);
    
    const response = await fetch('/api/send-sprint-waiting-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        linkedin,
        // Add any UTM parameters from the URL
        utmSource: new URLSearchParams(window.location.search).get('utm_source'),
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium'),
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        utmTerm: new URLSearchParams(window.location.search).get('utm_term'),
        utmContent: new URLSearchParams(window.location.search).get('utm_content')
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data.status === 'sent';
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
