
// Comprehensive email validation regex provided by senior engineer
const EMAIL_REGEX = /^(?:(?:[a-zA-Z0-9_!#\$%&'\*\+/=\?\^`\{\|\}~\-]+(?:\.[a-zA-Z0-9_!#\$%&'\*\+/=\?\^`\{\|\}~\-]+)*)|(?:"(?:\\[\x00-\x7F]|[^\x0A\x0D"\\])*"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:\.]+)\]))$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  canonicalValue?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validateLinkedInUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: 'LinkedIn URL is required' };
  }
  
  try {
    const parsedUrl = new URL(url);
    
    // Check if it's a LinkedIn domain (any locale)
    if (!parsedUrl.hostname.endsWith('linkedin.com')) {
      return { 
        isValid: false, 
        error: 'Please enter a valid LinkedIn profile URL (linkedin.com)' 
      };
    }
    
    // Check if it has the /in/ path
    if (!parsedUrl.pathname.startsWith('/in/')) {
      return { 
        isValid: false, 
        error: 'Please enter a LinkedIn profile URL (should contain /in/)' 
      };
    }
    
    // Extract and canonicalize the slug
    const slug = parsedUrl.pathname.replace(/^\/in\/|\/$/g, '');
    
    if (!slug) {
      return { 
        isValid: false, 
        error: 'Please enter a complete LinkedIn profile URL' 
      };
    }
    
    const canonicalValue = `linkedin.com/in/${slug}`;
    
    return { 
      isValid: true, 
      canonicalValue 
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Please enter a valid URL (include https://)' 
    };
  }
};
