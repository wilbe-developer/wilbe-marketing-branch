
import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Configure the transporter using the same Gmail setup as other email APIs
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'jesse@wilbe.com',
    pass: process.env.GMAIL_PASS,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const mailOptions = {
      from: `"Team Wilbe" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to Wilbe - Your Membership Has Been Approved!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Wilbe</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .features { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .feature-item { margin: 10px 0; padding-left: 20px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #28a745; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to Wilbe!</h1>
            <p>Your membership application has been approved</p>
          </div>
          
          <div class="content">
            <h2>Hi ${name},</h2>
            
            <p>Congratulations! We're excited to let you know that your membership application to Wilbe has been <strong>approved</strong>.</p>
            
            <p>You now have full access to our platform where you can connect with fellow scientist entrepreneurs, access exclusive resources, and accelerate your biotech journey.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://app.wilbe.com'}/login" class="button">
                Access Your Dashboard
              </a>
            </div>
            
            <div class="features">
              <h3>What you can do now:</h3>
              <div class="feature-item">Join BSF to accelerate your startup</div>
              <div class="feature-item">Connect with other scientist entrepreneurs</div>
              <div class="feature-item">Access our knowledge center and video library</div>
              <div class="feature-item">Connect with the community</div>
              <div class="feature-item">Get expert feedback on your science venture</div>
            </div>
            
            <h3>Next Steps:</h3>
            <ol>
              <li><strong>Log in to your account</strong> using the same email address you applied with</li>
              <li><strong>Complete your profile</strong> to help other members connect with you</li>
              <li><strong>Explore content </strong> that match your venture stage</li>
              <li><strong>Join the community</strong> and introduce yourself</li>
            </ol>
            
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our team. We're here to support your success!</p>
            
            <p>Welcome to the community!</p>
            
            <p>Best regards,<br>
            <strong>The Wilbe Team</strong></p>
          </div>
          
          <div class="footer">
            <p>Scientists First</p>
            <p>If you have any questions, reply to this email or contact us at members@wilbe.com</p>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Approval confirmation email sent:', info.messageId);

    res.status(200).json({ 
      status: 'sent',
      messageId: info.messageId,
      message: 'Approval confirmation email sent successfully'
    });

  } catch (error) {
    console.error('Error sending approval confirmation email:', error);
    res.status(500).json({ 
      status: 'error',
      error: 'Failed to send approval confirmation email' 
    });
  }
}
