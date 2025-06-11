
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

// HTML email template for team access notification
const createTeamAccessEmailHtml = (memberName: string, ownerName: string, accessLevel: string) => `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a365d;">You've Been Added to a BSF Team</h2>
    <p>Hi ${memberName},</p>
    <p><strong>${ownerName}</strong> has added you to their BSF team with <strong>${accessLevel}</strong> access.</p>
    
    <div style="background: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">What this means:</h3>
      ${accessLevel === 'view' 
        ? '<p>You can view their BSF progress and data room, but cannot edit tasks.</p>'
        : accessLevel === 'edit'
        ? '<p>You can view and edit their BSF tasks and progress.</p>'
        : '<p>You can view, edit, and manage team access for their BSF.</p>'
      }
      <p>You can access their BSF by logging into your Wilbe account and navigating to the shared BSF section.</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://wilbe.com/sprint/dashboard" 
         style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Access BSF Dashboard
      </a>
    </div>
    
    <p>If you have any questions about your access or the BSF process, feel free to reach out.</p>
    <p>Putting Scientists First,<br/>Team Wilbe</p>
  </div>
</body>
</html>
`;

// Slack message formatter
const createSlackMessage = (memberName: string, memberEmail: string, ownerName: string, accessLevel: string) => {
  return {
    text: `👥 New team member added to BSF: *${memberName}* (${memberEmail})\nAdded by: ${ownerName}\nAccess level: ${accessLevel}`
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memberName, memberEmail, ownerName, accessLevel } = req.body;

    // Validate required fields
    if (!memberName || !memberEmail || !ownerName || !accessLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email to new team member
    await transporter.sendMail({
      from: '"Wilbe Team" <team@wilbe.com>',
      to: memberEmail,
      subject: `You've been added to ${ownerName}'s BSF team`,
      html: createTeamAccessEmailHtml(memberName, ownerName, accessLevel),
      replyTo: 'members@wilbe.com'
    });

    // Send Slack notification to admins
    if (process.env.SLACK_WEBHOOK_WAITLIST_URL) {
      await fetch(process.env.SLACK_WEBHOOK_WAITLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSlackMessage(memberName, memberEmail, ownerName, accessLevel)),
      });
    }

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Error sending team access notifications:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
