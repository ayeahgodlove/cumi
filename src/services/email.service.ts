import FormData from "form-data";
import Mailgun from "mailgun.js";
import logger from "@utils/logger";

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
  private readonly baseUrl: string;
  private readonly logoUrl: string;

  constructor() {
    const mailgun = new Mailgun(FormData);
    
    const apiKey = process.env.MAILGUN_API_KEY || process.env.MAIGUN_API_KEY || "API_KEY";
    
    if (!apiKey || apiKey === "API_KEY") {
      logger.error("⚠️ WARNING: MAILGUN_API_KEY is not configured!");
    }
    
    this.mailgun = mailgun.client({
      username: "api",
      key: apiKey,
      url: process.env.MAILGUN_BASE_URL || "https://api.eu.mailgun.net"
    });
    this.domain = process.env.MAILGUN_DOMAIN || "mail.cumi.dev";
    // Get base URL with proper fallback (NEVER localhost in production)
    const getBaseUrl = () => {
      if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
      }
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
      }
      if (process.env.NODE_ENV === 'production') {
        return 'https://cumi.dev';
      }
      return 'http://localhost:3000';
    };
    
    this.baseUrl = getBaseUrl();
    this.logoUrl = `${this.baseUrl}/cumi-green.jpg`;
    
    logger.info("📧 Email Service Initialized:", {
      domain: this.domain,
      apiUrl: process.env.MAILGUN_BASE_URL || "https://api.eu.mailgun.net",
      hasApiKey: !!apiKey && apiKey !== "API_KEY"
    });
  }

  /**
   * Generate modern email template with CUMI branding
   */
  private getEmailTemplate(params: {
    title: string;
    subtitle: string;
    content: string;
    showLogo?: boolean;
  }): string {
    const { title, subtitle, content, showLogo = true } = params;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title} - CUMI</title>
        <!--[if mso]>
        <style type="text/css">
          body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
        </style>
        <![endif]-->
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1F2937; 
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            margin: 0;
            padding: 0;
            width: 100%;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          .email-wrapper {
            width: 100%;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            padding: 40px 20px;
          }
          
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #FFFFFF;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.05);
          }
          
          .header { 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 100%);
            color: white; 
            padding: 48px 40px; 
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            animation: patternMove 20s linear infinite;
          }
          
          @keyframes patternMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 30px); }
          }
          
          .logo-container {
            position: relative;
            z-index: 1;
            margin-bottom: 24px;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 16px;
            margin: 0 auto;
            padding: 8px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .header h1 { 
            font-size: 32px; 
            font-weight: 700;
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .header p {
            font-size: 18px;
            opacity: 0.95;
            position: relative;
            z-index: 1;
            font-weight: 400;
          }
          
          .content { 
            padding: 48px 40px; 
            background: #FFFFFF;
          }
          
          .content h2 {
            color: #1F2937;
            font-size: 26px;
            margin-bottom: 24px;
            font-weight: 700;
            line-height: 1.3;
          }
          
          .content p {
            color: #4B5563;
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.8;
          }
          
          .content strong {
            color: #1F2937;
            font-weight: 600;
          }
          
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          
          .button { 
            display: inline-block; 
            padding: 18px 40px; 
            background: linear-gradient(135deg, #22C55E 0%, #14B8A6 100%);
            color: white !important; 
            text-decoration: none; 
            border-radius: 14px; 
            font-weight: 600;
            font-size: 17px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            letter-spacing: 0.3px;
          }
          
          .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
          }
          
          .info-box {
            background: linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%);
            border-left: 4px solid #3B82F6;
            border-radius: 12px;
            padding: 20px;
            margin: 28px 0;
          }
          
          .info-box p {
            color: #1E40AF;
            margin: 0;
            font-size: 15px;
          }
          
          .warning-box {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border-left: 4px solid #F59E0B;
            border-radius: 12px;
            padding: 20px;
            margin: 28px 0;
          }
          
          .warning-box p {
            color: #92400E;
            margin: 0;
            font-size: 15px;
            line-height: 1.6;
          }
          
          .success-box {
            background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
            border-left: 4px solid #22C55E;
            border-radius: 12px;
            padding: 20px;
            margin: 28px 0;
          }
          
          .success-box p {
            color: #065F46;
            margin: 0;
            font-size: 15px;
          }
          
          .features-list {
            background: #F9FAFB;
            border-radius: 14px;
            padding: 28px;
            margin: 28px 0;
          }
          
          .features-list h3 {
            color: #1F2937;
            font-size: 20px;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .features-list ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .features-list li {
            color: #4B5563;
            font-size: 16px;
            margin-bottom: 14px;
            padding-left: 32px;
            position: relative;
            line-height: 1.6;
          }
          
          .features-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #22C55E;
            font-weight: bold;
            font-size: 20px;
            line-height: 1;
          }
          
          .link-box {
            background: #F3F4F6;
            border: 1px dashed #D1D5DB;
            padding: 16px;
            border-radius: 10px;
            margin: 24px 0;
            word-break: break-all;
          }
          
          .link-box p {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #374151;
            margin: 0;
            line-height: 1.5;
          }
          
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%);
            margin: 32px 0;
          }
          
          .footer { 
            text-align: center; 
            padding: 40px; 
            background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
            border-top: 1px solid #E5E7EB;
          }
          
          .footer p {
            color: #6B7280;
            font-size: 14px;
            line-height: 1.6;
          }
          
          .footer strong {
            color: #22C55E;
            font-weight: 600;
          }
          
          .social-links {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 12px;
            color: #6B7280;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s ease;
          }
          
          .social-links a:hover {
            color: #22C55E;
          }
          
          .copyright {
            margin-top: 20px;
            color: #9CA3AF;
            font-size: 13px;
          }
          
          /* Mobile Responsive */
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 20px 10px; }
            .email-container { border-radius: 16px; }
            .header { padding: 36px 24px; }
            .content { padding: 32px 24px; }
            .footer { padding: 28px 20px; }
            .header h1 { font-size: 26px; }
            .header p { font-size: 16px; }
            .content h2 { font-size: 22px; }
            .content p { font-size: 15px; }
            .button { padding: 16px 32px; font-size: 16px; width: 100%; }
            .logo { width: 64px; height: 64px; }
            .features-list { padding: 20px; }
            .social-links a { margin: 0 8px; font-size: 13px; }
          }
          
          /* Dark Mode Support */
          @media (prefers-color-scheme: dark) {
            .email-container { border: 1px solid #374151; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              ${showLogo ? `
              <div class="logo-container">
                <div class="logo">
                  <img src="${this.logoUrl}" alt="CUMI Logo" style="border-radius: 12px;">
                </div>
              </div>
              ` : ''}
              <h1>${title}</h1>
              <p>${subtitle}</p>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              <p><strong>Best regards,</strong><br>The CUMI Team</p>
              <div class="social-links">
                <a href="${this.baseUrl}">Website</a> • 
                <a href="${this.baseUrl}/contact_us">Support</a> • 
                <a href="${this.baseUrl}/faqs">FAQs</a>
              </div>
              <p class="copyright">© ${new Date().getFullYear()} CUMI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendEmail(options: EmailOptions): Promise<any> {
    try {
      const recipients = Array.isArray(options.to) ? options.to : [options.to];
      const to = recipients.map(r => r.name ? `${r.name} <${r.email}>` : r.email);

      // Construct FROM address from environment variables
      const fromName = process.env.MAILGUN_FROM_NAME || 'CUMI';
      const fromEmail = process.env.MAILGUN_FROM_EMAIL || `noreply@${this.domain}`;
      const from = process.env.MAILGUN_FROM || `${fromName} <${fromEmail}>`;
      
      const messageData: any = {
        from,
        to,
        subject: options.subject,
      };
      
      logger.info("📧 Sending email:", {
        from,
        to: to.join(', '),
        subject: options.subject,
        domain: this.domain
      });

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
      logger.info("✅ Email sent successfully:", {
        id: data.id,
        message: data.message
      });
      return data;
    } catch (error: any) {
      logger.error("❌ Error sending email:", {
        error: error.message,
        status: error.status,
        details: error.details || error
      });
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<any> {
    const resetUrl = `${this.baseUrl}/auth/reset-password?token=${resetToken}`;
    
    logger.info("🔐 Sending password reset email:", {
      to: email,
      name,
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : '[hidden]'
    });
    
    const content = `
      <h2>Hello ${name},</h2>
      <p>We received a request to reset the password for your CUMI account. Don't worry, we've got you covered!</p>
      
      <div class="button-container">
        <a href="${resetUrl}" class="button">🔑 Reset My Password</a>
      </div>
      
      <div class="warning-box">
        <p><strong>⚠️ Security Notice:</strong> This password reset link will expire in <strong>1 hour</strong> for your security. If you didn't request this password reset, please ignore this email and consider changing your password immediately.</p>
      </div>
      
      <div class="divider"></div>
      
      <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
      <div class="link-box">
        <p>${resetUrl}</p>
      </div>
      
      <p>If you have any questions or need assistance, our support team is here to help you 24/7.</p>
      
      <div class="info-box">
        <p><strong>💡 Security Tip:</strong> Never share your password with anyone. CUMI will never ask for your password via email.</p>
      </div>
    `;
    
    const html = this.getEmailTemplate({
      title: 'Password Reset Request',
      subtitle: 'Secure your account with a new password',
      content
    });

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
    const dashboardUrl = `${this.baseUrl}/dashboard`;
    const coursesUrl = `${this.baseUrl}/courses`;
    
    const content = `
      <h2>🎉 Welcome ${name}!</h2>
      <p>We're absolutely thrilled to have you join the <strong>CUMI</strong> community! Your account has been successfully created, and you're all set to begin your exciting learning journey.</p>
      
      <div class="success-box">
        <p><strong>✅ Your account is now active!</strong> You can start exploring courses, attending events, and connecting with fellow learners right away.</p>
      </div>
      
      <div class="features-list">
        <h3>🚀 What you can do now:</h3>
        <ul>
          <li>Access your personalized dashboard and track your progress</li>
          <li>Browse and enroll in 100+ professional courses</li>
          <li>Register for upcoming webinars and workshops</li>
          <li>Connect with 10,000+ learners worldwide</li>
          <li>Earn certificates and digital badges</li>
          <li>Download course materials and resources</li>
        </ul>
      </div>
      
      <div class="button-container">
        <a href="${dashboardUrl}" class="button">🎯 Go to My Dashboard</a>
      </div>
      
      <div class="divider"></div>
      
      <div class="info-box">
        <p><strong>💡 Pro Tip:</strong> Complete your profile to get personalized course recommendations tailored to your interests and goals!</p>
      </div>
      
      <p><strong>Explore our courses:</strong> <a href="${coursesUrl}" style="color: #22C55E; text-decoration: none;">Browse Course Catalog →</a></p>
      
      <p>If you have any questions or need assistance getting started, our support team is available 24/7 to help you succeed!</p>
    `;
    
    const html = this.getEmailTemplate({
      title: 'Welcome to CUMI!',
      subtitle: 'Your learning journey starts here 🎓',
      content
    });

    const text = `
      Welcome to CUMI!
      
      Hello ${name},
      
      We're thrilled to have you join our community! Your account has been successfully created and you're ready to start your learning journey.
      
      What you can do now:
      ✓ Access your personalized dashboard
      ✓ Browse and enroll in courses
      ✓ Register for upcoming events
      ✓ Connect with other learners
      ✓ Track your learning progress
      ✓ Earn certificates and badges
      
      Visit your dashboard: ${this.baseUrl}/dashboard
      
      If you have any questions or need assistance, our support team is here to help!
      
      Best regards,
      The CUMI Team
    `;

    return this.sendEmail({
      to: { email, name },
      subject: "Welcome to CUMI! Your Account is Ready 🎉",
      html,
      text
    });
  }

  async sendNotificationEmail(email: string, name: string, title: string, message: string, actionUrl?: string): Promise<any> {
    const content = `
      <h2>Hello ${name},</h2>
      <p>${message}</p>
      
      ${actionUrl ? `
        <div class="button-container">
          <a href="${actionUrl}" class="button">View Details →</a>
        </div>
      ` : ''}
      
      <div class="info-box">
        <p><strong>ℹ️ Note:</strong> This is an automated notification from your CUMI account. You're receiving this because you opted in for email notifications.</p>
      </div>
      
      <p>You can manage your notification preferences anytime from your <a href="${this.baseUrl}/dashboard/settings" style="color: #22C55E; text-decoration: none;">account settings</a>.</p>
    `;
    
    const html = this.getEmailTemplate({
      title,
      subtitle: 'A new update from CUMI',
      content
    });

    const text = `
      ${title} - CUMI
      
      Hello ${name},
      
      ${message}
      
      ${actionUrl ? `View details: ${actionUrl}` : ''}
      
      You can manage your notification preferences from your account settings: ${this.baseUrl}/dashboard/settings
      
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
    logger.info(`📧 Sending bulk email to ${recipients.length} recipients`);
    const sendPromises = recipients.map(recipient =>
      this.sendEmail({ to: recipient, subject, html, text })
    );
    return Promise.allSettled(sendPromises);
  }
}

export const emailService = new EmailService();

