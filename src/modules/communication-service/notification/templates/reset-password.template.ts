import { TemplateResult } from './verify-email.template';

export const resetPasswordTemplate = (data: {
  name: string;
  url: string;
}): TemplateResult => {
  return {
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${data.name || 'there'},</p>
        <p>We received a request to reset your password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${data.url}" style="display: inline-block; padding: 12px 24px; background-color: #00a651; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This password reset link will expire in 15 minutes.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
    `,
    text: `Hello ${data.name || 'there'}! Reset your password by visiting: ${data.url}. This link expires in 15 minutes.`,
  };
};
