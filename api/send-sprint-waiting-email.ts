
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'jesse@wilbe.com',
    pass: process.env.GMAIL_APP_PASSWORD, // Google App Password
  },
});

// HTML email template for sprint waiting confirmation
const createEmailHtml = (name: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a365d;">Thank You for Signing Up!</h2>
    <p>Hi ${name},</p>
    <p>Your BSF profile has been saved successfully.</p>
    <p>We're preparing to launch the full BSF experience soon. We'll notify you when it's ready.</p>
    
    <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2a4a8d;">What happens next?</h3>
      <p>Our team is putting the finishing touches on the BSF experience. 
         You'll receive an email when the platform is open, and you'll be able to 
         access your dashboard with all your saved information.</p>
    </div>
    
    <p>Putting Scientists First,<br/>Team Wilbe</p>
  </div>
</body>
</html>
`;

// Slack message formatter for waitlist notifications
const createWaitlistSlackMessage = (name: string, email: string, linkedin: string = '', utmSource: string = '', utmMedium: string = '') => {
  let message = `✅ New BSF Signup: *${name}* (${email})`;
  
  if (linkedin) {
    message += `\nLinkedIn: ${linkedin}`;
  }
  
  // Add UTM parameters if available
  if (utmSource || utmMedium) {
    message += '\n📊 Attribution:';
    if (utmSource) message += ` source=${utmSource}`;
    if (utmMedium) message += ` medium=${utmMedium}`;
  }
  
  return { text: message };
};

// Slack message formatter for sandbox approval
const createSandboxApprovalSlackMessage = (name: string, email: string, linkedin: string = '', utmSource: string = '') => {
  let message = `🚀 New Sprint Profile Sandbox Review: *${name}* (${email})`;
  
  if (linkedin) {
    message += `\nLinkedIn: ${linkedin}`;
  }
  
  if (utmSource) {
    message += `\nSource: ${utmSource}`;
  }
  
  message += '\n\n💼 *Action Required:* Review and approve for sandbox access';
  
  return { text: message };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      email, 
      linkedin, 
      utmSource, 
      utmMedium, 
      utmCampaign, 
      utmTerm, 
      utmContent 
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send confirmation email to user
    await transporter.sendMail({
      from: '"Wilbe Team" <team@wilbe.com>',
      to: email,
      subject: "Your BSF Profile Confirmation",
      html: createEmailHtml(name),
      replyTo: 'members@wilbe.com'
    });

    // Send Slack notification to waitlist channel
    if (process.env.SLACK_WEBHOOK_WAITLIST_URL) {
      await fetch(process.env.SLACK_WEBHOOK_WAITLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createWaitlistSlackMessage(name, email, linkedin, utmSource, utmMedium)),
      });
    }

    // Send additional Slack notification to sandbox approval channel.
    if (process.env.SLACK_WEBHOOK_SANDBOX_APPROVAL) {
      await fetch(process.env.SLACK_WEBHOOK_SANDBOX_APPROVAL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSandboxApprovalSlackMessage(name, email, linkedin, utmSource)),
      });
    }

    // Log UTM parameters for debugging
    console.log('UTM parameters received:', { utmSource, utmMedium, utmCampaign, utmTerm, utmContent });

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Error sending waiting notifications:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
