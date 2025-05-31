
import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Email transporter setup
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'jesse@wilbe.com',
    pass: process.env.GMAIL_APP_PASSWORD, // Google App Password
  },
});

// HTML email template for approval confirmation
const createApprovalEmailHtml = (name: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a365d;">Welcome to BSF! Your Application Has Been Approved</h2>
    <p>Hi ${name},</p>
    <p>Great news! Your Wilbe membership has been approved. You now have full access to the Wilbe platform.</p>
    
    <div style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2a4a8d;">What you can do now:</h3>
      <ul>
        <li>Start BSF to work on startup challenges</li>
        <li>Connect with other members in the community</li>
        <li>Browse our knowledge center and resources</li>
        <li>Join upcoming events</li>
      </ul>
    </div>
    
    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2d5a2d;">Next Steps:</h3>
      <p>1. <strong>Log in to your account</strong> at app.wilbe.com</p>
      <p>2. <strong>Complete your profile</strong> to help other members connect with you</p>
      <p>3. <strong>Explore BSF</strong> to start working on challenges</p>
      <p>4. <strong>Join the community</strong> to network with fellow scientists</p>
    </div>
    
    <p>If you have any questions or need help getting started, don't hesitate to reach out to our team.</p>
    
    <p>Welcome to the community!<br/>Team Wilbe</p>
  </div>
</body>
</html>
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing required fields: name and email' });
    }

    // Send approval confirmation email to user
    await transporter.sendMail({
      from: '"Wilbe Team" <team@wilbe.com>',
      to: email,
      subject: "Welcome to Wilbe - Your Application Has Been Approved!",
      html: createApprovalEmailHtml(name),
      replyTo: 'members@wilbe.com'
    });

    console.log(`Approval confirmation email sent to ${email} (${name})`);

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Error sending approval confirmation:', error);
    return res.status(500).json({ error: 'Failed to send approval confirmation' });
  }
}
