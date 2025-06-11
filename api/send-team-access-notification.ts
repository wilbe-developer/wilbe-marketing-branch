
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

// HTML email template for team access notification
const createTeamAccessEmailHtml = (memberName: string, ownerName: string, accessLevel: string, invitationToken?: string, memberEmail?: string) => {
  const isInvitation = !!invitationToken;
  const acceptUrl = invitationToken && memberEmail 
    ? `https://wilbe.com/accept-invitation?token=${invitationToken}&email=${encodeURIComponent(memberEmail)}` 
    : 'https://wilbe.com/sprint/dashboard';
  
  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #1a365d;">${isInvitation ? 'You\'ve Been Invited to Join a BSF Team' : 'You\'ve Been Added to a BSF Team'}</h2>
    <p>Hi ${memberName},</p>
    <p><strong>${ownerName}</strong> has ${isInvitation ? 'invited you to join' : 'added you to'} their BSF team with <strong>${accessLevel}</strong> access.</p>
    
    <div style="background: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">What this means:</h3>
      ${accessLevel === 'View Only' 
        ? '<p>You can view their BSF progress and data room, but cannot edit tasks.</p>'
        : accessLevel === 'Can Edit'
        ? '<p>You can view and edit their BSF tasks and progress.</p>'
        : '<p>You can view, edit, and manage team access for their BSF.</p>'
      }
      ${isInvitation 
        ? '<p>Click the button below to accept the invitation and access their BSF.</p>'
        : '<p>You can access their BSF by logging into your Wilbe account and navigating to the shared BSF section.</p>'
      }
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${acceptUrl}" 
         style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
        ${isInvitation ? 'Accept Invitation' : 'Access BSF Dashboard'}
      </a>
    </div>
    
    ${isInvitation ? '<p style="font-size: 14px; color: #666;"><strong>Note:</strong> If you don\'t have a Wilbe account yet, one will be created for you automatically when you click the link above.</p>' : ''}
    
    <p>If you have any questions about your access or the BSF process, feel free to reach out.</p>
    <p>Putting Scientists First,<br/>Team Wilbe</p>
  </div>
</body>
</html>
`;
};

// Slack message formatter
const createSlackMessage = (memberName: string, memberEmail: string, ownerName: string, accessLevel: string, isInvitation: boolean = false) => {
  const action = isInvitation ? 'invited to' : 'added to';
  return {
    text: `👥 Team member ${action} BSF: *${memberName}* (${memberEmail})\n${isInvitation ? 'Invited' : 'Added'} by: ${ownerName}\nAccess level: ${accessLevel}`
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { memberName, memberEmail, ownerName, accessLevel, invitationToken, isInvitation = false } = req.body;

    // Validate required fields
    if (!memberName || !memberEmail || !ownerName || !accessLevel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email to new team member or invitee
    const emailSubject = isInvitation 
      ? `You've been invited to join ${ownerName}'s BSF team`
      : `You've been added to ${ownerName}'s BSF team`;

    await transporter.sendMail({
      from: '"Wilbe Team" <team@wilbe.com>',
      to: memberEmail,
      subject: emailSubject,
      html: createTeamAccessEmailHtml(memberName, ownerName, accessLevel, invitationToken, memberEmail),
      replyTo: 'members@wilbe.com'
    });

    // Send Slack notification to admins
    if (process.env.SLACK_WEBHOOK_WAITLIST_URL) {
      await fetch(process.env.SLACK_WEBHOOK_WAITLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createSlackMessage(memberName, memberEmail, ownerName, accessLevel, isInvitation)),
      });
    }

    return res.status(200).json({ status: 'sent' });
  } catch (error) {
    console.error('Error sending team access notifications:', error);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
}
