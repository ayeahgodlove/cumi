import FormData from "form-data";
import Mailgun from "mailgun.js";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  templateData?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    data: Buffer | string;
    contentType?: string;
  }>;
}

class EmailService {
  private mailgun: any;
  private domain: string;

  constructor() {
    const mailgun = new Mailgun(FormData);
    this.mailgun = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "API_KEY",
      url: process.env.MAILGUN_BASE_URL || "https://api.mailgun.net"
    });
    this.domain = process.env.MAILGUN_DOMAIN || "mail.cumi.dev";
  }

  async sendEmail(options: EmailOptions): Promise<any> {
    try {
      const recipients = Array.isArray(options.to) ? options.to : [options.to];
      const to = recipients.map(r => r.name ? `${r.name} <${r.email}>` : r.email);

      const messageData: any = {
        from: process.env.MAILGUN_FROM || `Mailgun Sandbox <postmaster@${this.domain}>`,
        to,
        subject: options.subject,
      };

      if (options.html) {
        messageData.html = options.html;
      }

      if (options.text) {
        messageData.text = options.text;
      }

      if (options.attachments) {
        messageData.attachment = options.attachments;
      }

      const data = await this.mailgun.messages.create(this.domain, messageData);
      console.log("Email sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<any> {
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - CUMI</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1F2937; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.04);
          }
          .header { 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #22C55E;
            position: relative;
            z-index: 1;
          }
          .header h1 { 
            font-size: 28px; 
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 40px 30px; 
            background: #FFFFFF;
          }
          .content h2 {
            color: #1F2937;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .content p {
            color: #6B7280;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.7;
          }
          .button { 
            display: inline-block; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            color: white; 
            text-decoration: none; 
            border-radius: 12px; 
            margin: 24px 0; 
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05);
          }
          .security-notice {
            background: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
          }
          .security-notice p {
            color: #92400E;
            margin: 0;
            font-size: 14px;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            color: #6B7280;
            font-size: 14px;
            margin: 0;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6B7280;
            text-decoration: none;
            font-size: 14px;
          }
          .social-links a:hover {
            color: #22C55E;
          }
          @media (max-width: 600px) {
            .email-container { margin: 10px; border-radius: 12px; }
            .header, .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">CUMI</div>
            <h1>Password Reset Request</h1>
            <p>Secure your account with a new password</p>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password for your CUMI account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset My Password</a>
            </div>
            
            <div class="security-notice">
              <p><strong>Security Notice:</strong> This link will expire in 1 hour for your security. If you didn't request this password reset, please ignore this email and consider changing your password.</p>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #F3F4F6; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; color: #374151;">${resetUrl}</p>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br><strong>The CUMI Team</strong></p>
            <div class="social-links">
              <a href="#">Website</a> • 
              <a href="#">Support</a> • 
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request - CUMI
      
      Hello ${name},
      
      We received a request to reset your password for your CUMI account. 
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour for your security.
      
      If you didn't request this password reset, please ignore this email and consider changing your password.
      
      If you have any questions or need assistance, please contact our support team.
      
      Best regards,
      The CUMI Team
    `;

    return this.sendEmail({
      to: { email, name },
      subject: "Reset Your CUMI Password",
      html,
      text
    });
  }

  async sendRegistrationConfirmationEmail(email: string, name: string): Promise<any> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to CUMI</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1F2937; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.04);
          }
          .header { 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #22C55E;
            position: relative;
            z-index: 1;
          }
          .header h1 { 
            font-size: 28px; 
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 40px 30px; 
            background: #FFFFFF;
          }
          .content h2 {
            color: #1F2937;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .content p {
            color: #6B7280;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.7;
          }
          .features {
            background: #F9FAFB;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          .features h3 {
            color: #1F2937;
            font-size: 18px;
            margin-bottom: 16px;
            font-weight: 600;
          }
          .features ul {
            list-style: none;
            padding: 0;
          }
          .features li {
            color: #6B7280;
            font-size: 16px;
            margin-bottom: 12px;
            padding-left: 24px;
            position: relative;
          }
          .features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #22C55E;
            font-weight: bold;
            font-size: 16px;
          }
          .button { 
            display: inline-block; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            color: white; 
            text-decoration: none; 
            border-radius: 12px; 
            margin: 24px 0; 
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05);
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            color: #6B7280;
            font-size: 14px;
            margin: 0;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6B7280;
            text-decoration: none;
            font-size: 14px;
          }
          .social-links a:hover {
            color: #22C55E;
          }
          @media (max-width: 600px) {
            .email-container { margin: 10px; border-radius: 12px; }
            .header, .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">CUMI</div>
            <h1>Welcome to CUMI!</h1>
            <p>Your learning journey starts here</p>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Welcome to CUMI! We're thrilled to have you join our community of learners and professionals. Your account has been successfully created and you're ready to start your learning journey.</p>
            
            <div class="features">
              <h3>What you can do now:</h3>
              <ul>
                <li>Access your personalized dashboard</li>
                <li>Browse and enroll in courses</li>
                <li>Register for upcoming events</li>
                <li>Connect with other learners</li>
                <li>Track your learning progress</li>
                <li>Earn certificates and badges</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <p>If you have any questions or need assistance getting started, our support team is here to help. Don't hesitate to reach out!</p>
          </div>
          <div class="footer">
            <p>Best regards,<br><strong>The CUMI Team</strong></p>
            <div class="social-links">
              <a href="#">Website</a> • 
              <a href="#">Support</a> • 
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to CUMI!
      
      Hello ${name},
      
      Welcome to CUMI! We're thrilled to have you join our community of learners and professionals. Your account has been successfully created and you're ready to start your learning journey.
      
      What you can do now:
      ✓ Access your personalized dashboard
      ✓ Browse and enroll in courses
      ✓ Register for upcoming events
      ✓ Connect with other learners
      ✓ Track your learning progress
      ✓ Earn certificates and badges
      
      Visit your dashboard: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard
      
      If you have any questions or need assistance getting started, our support team is here to help. Don't hesitate to reach out!
      
      Best regards,
      The CUMI Team
    `;

    return this.sendEmail({
      to: { email, name },
      subject: "Welcome to CUMI! Your Account is Ready",
      html,
      text
    });
  }

  async sendNotificationEmail(email: string, name: string, title: string, message: string, actionUrl?: string): Promise<any> {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - CUMI</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1F2937; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            min-height: 100vh;
            padding: 20px;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.04);
          }
          .header { 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }
          .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            color: #22C55E;
            position: relative;
            z-index: 1;
          }
          .header h1 { 
            font-size: 28px; 
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          .header p {
            font-size: 16px;
            opacity: 0.9;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 40px 30px; 
            background: #FFFFFF;
          }
          .content h2 {
            color: #1F2937;
            font-size: 24px;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .content p {
            color: #6B7280;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.7;
          }
          .notification-box {
            background: #F0F9FF;
            border: 1px solid #0EA5E9;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          .notification-box p {
            color: #0C4A6E;
            margin: 0;
            font-size: 16px;
            line-height: 1.6;
          }
          .button { 
            display: inline-block; 
            padding: 16px 32px; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%);
            color: white; 
            text-decoration: none; 
            border-radius: 12px; 
            margin: 24px 0; 
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06);
          }
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05);
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            background: #F9FAFB;
            border-top: 1px solid #E5E7EB;
          }
          .footer p {
            color: #6B7280;
            font-size: 14px;
            margin: 0;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6B7280;
            text-decoration: none;
            font-size: 14px;
          }
          .social-links a:hover {
            color: #22C55E;
          }
          @media (max-width: 600px) {
            .email-container { margin: 10px; border-radius: 12px; }
            .header, .content { padding: 30px 20px; }
            .footer { padding: 20px; }
            .header h1 { font-size: 24px; }
            .content h2 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">CUMI</div>
            <h1>${title}</h1>
            <p>Stay updated with your learning journey</p>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            
            <div class="notification-box">
              <p>${message}</p>
            </div>
            
            ${actionUrl ? `
            <div style="text-align: center;">
              <a href="${actionUrl}" class="button">Take Action</a>
            </div>
            ` : ''}
            
            <p>If you have any questions or need assistance, our support team is here to help.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br><strong>The CUMI Team</strong></p>
            <div class="social-links">
              <a href="#">Website</a> • 
              <a href="#">Support</a> • 
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ${title} - CUMI
      
      Hello ${name},
      
      ${message}
      
      ${actionUrl ? `Take action: ${actionUrl}` : ''}
      
      If you have any questions or need assistance, our support team is here to help.
      
      Best regards,
      The CUMI Team
    `;

    return this.sendEmail({
      to: { email, name },
      subject: title,
      html,
      text
    });
  }

  async sendBulkEmail(recipients: EmailRecipient[], subject: string, html: string, text: string): Promise<any> {
    try {
      // For bulk emails, we'll send individual emails to avoid spam issues
      const results = [];
      for (const recipient of recipients) {
        try {
          const result = await this.sendEmail({
            to: recipient,
            subject,
            html,
            text
          });
          results.push({ recipient: recipient.email, success: true, result });
        } catch (error) {
          results.push({ recipient: recipient.email, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      return results;
    } catch (error) {
      console.error("Error sending bulk email:", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
export default emailService;
