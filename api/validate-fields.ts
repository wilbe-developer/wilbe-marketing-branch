
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Comprehensive email validation regex
const EMAIL_REGEX = /^(?:(?:[a-zA-Z0-9_!#\$%&'\*\+/=\?\^`\{\|\}~\-]+(?:\.[a-zA-Z0-9_!#\$%&'\*\+/=\?\^`\{\|\}~\-]+)*)|(?:"(?:\\[\x00-\x7F]|[^\x0A\x0D"\\])*"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:[0-9]{1,3}\.){3}[0-9]{1,3}|IPv6:[0-9a-fA-F:\.]+)\]))$/;

interface ValidationRequest {
  email?: string;
  linkedin?: string;
  linkedinOptOut?: boolean;
}

interface ValidationResponse {
  email?: {
    isValid: boolean;
    error?: string;
  };
  linkedin?: {
    isValid: boolean;
    error?: string;
    canonicalValue?: string;
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, linkedin, linkedinOptOut }: ValidationRequest = req.body;
  const response: ValidationResponse = {};

  // Validate email if provided
  if (email !== undefined) {
    if (!email.trim()) {
      response.email = { isValid: false, error: 'Email is required' };
    } else if (!EMAIL_REGEX.test(email)) {
      response.email = { isValid: false, error: 'Please enter a valid email address' };
    } else {
      response.email = { isValid: true };
    }
  }

  // Validate LinkedIn if provided and not opted out
  if (linkedin !== undefined && !linkedinOptOut) {
    if (!linkedin.trim()) {
      response.linkedin = { isValid: false, error: 'LinkedIn URL is required' };
    } else {
      try {
        const parsedUrl = new URL(linkedin);
        
        // Check if it's a LinkedIn domain (any locale)
        if (!parsedUrl.hostname.endsWith('linkedin.com')) {
          response.linkedin = { 
            isValid: false, 
            error: 'Please enter a valid LinkedIn profile URL (linkedin.com)' 
          };
        } else if (!parsedUrl.pathname.startsWith('/in/')) {
          response.linkedin = { 
            isValid: false, 
            error: 'Please enter a LinkedIn profile URL (should contain /in/)' 
          };
        } else {
          // Extract and canonicalize the slug
          const slug = parsedUrl.pathname.replace(/^\/in\/|\/$/g, '');
          
          if (!slug) {
            response.linkedin = { 
              isValid: false, 
              error: 'Please enter a complete LinkedIn profile URL' 
            };
          } else {
            const canonicalValue = `linkedin.com/in/${slug}`;
            response.linkedin = { 
              isValid: true, 
              canonicalValue 
            };
          }
        }
      } catch (error) {
        response.linkedin = { 
          isValid: false, 
          error: 'Please enter a valid URL (include https://)' 
        };
      }
    }
  } else if (linkedinOptOut) {
    // If opted out, LinkedIn is valid (not required)
    response.linkedin = { isValid: true };
  }

  res.status(200).json(response);
}
