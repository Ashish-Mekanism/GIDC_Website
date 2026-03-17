// services/SendGridService.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export class SendGridService {
  public async sendEmail(to: string | string[], subject: string, html: string, text?: string) {
    if (!html && !text) {
      throw new Error("Either 'html' or 'text' content is required.");
    }

    const msg = {
      to,
      from: process.env.SMTP_EMAIL_USERNAME || 'your_verified_email@example.com',
      subject,
      html,
      text: text || '',
    };

    try {
      const response = await sgMail.send(msg,true);
      console.log('✅ Email sent:', response[0].statusCode);
      return response;
    } catch (error: any) {
      console.error('❌ SendGrid error:', error?.response?.body || error.message);
      throw new Error('Failed to send email via SendGrid');
    }
  }
}
