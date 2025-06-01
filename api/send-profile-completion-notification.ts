import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'jesse@wilbe.com',
    pass: process.env.GMAIL_APP_PASSWORD, // Google App Password
  },
});

// HTML email template for profile completion confirmation
const createEmailHtml = (name: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a365d;">Application Received!</h2>
    <p>Hi ${name},</p>
    <p>Thank you for submitting your membership application to Wilbe. We've received your information and our team is now reviewing your application.</p>
    
    <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2a4a8d;">What happens next?</h3>
      <p>Our team will review your application manually to ensure the quality of our community. 
         You'll receive an email notification once your application has been approved and you can 
         access the full Wilbe platform.</p>
    </div>
    
    <p>This process typically takes 1-2 business days. We appreciate your patience!</p>
    
    <p>Putting Scientists First,<br/>Team Wilbe</p>
  </div>
</body>
</html>
`;

// Slack message formatter for sandbox approval
const createSlackMessage = (name: string, email: string, institution: string = '', linkedin: string = '') => {
  let message = `🔍 New Profile Application Review Needed: *${name}* (${email})`;
  
  if (institution) {
    message += `\nInstitution: ${institution}`;
  }
  
  if (linkedin) {
    message += `\nLinkedIn: ${linkedin}`;
  }
  
  message += '\n\n💼 *Action Required:* Review and approve for sandbox access';
  
  return { text: message };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      name, 
      email, 
      institution, 
      linkedin 
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send confirmation email to user
    await transporter.sendMail({
      from: '"Wilbe Team" <team@wilbe.com>',
      to: email,
      subject: "Your Wilbe Membership Application is Under Review",
      html: createEmailHtml(name),
      replyTo: 'members@wilbe.com'
    });

    // Send Slack notification to sandbox approval channel
    if (process.env.SLACK_WEBHOOK_SANDBOX_APPROVAL) {
      await fetch(process.env.SLACK_WEBHOOK_SANDBOX_APPROVAL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSlackMessage(name, email, institution, linkedin)),
      });
    }

    console.log('Profile completion notifications sent for:', email);

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Error sending profile completion notifications:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
