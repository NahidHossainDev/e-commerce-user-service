export interface TemplateResult {
  subject: string;
  html: string;
  text: string;
}

export const verifyEmailTemplate = (data: {
  name: string;
  url: string;
  token: string;
}): TemplateResult => {
  return {
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333;">Welcome to our E-Commerce Store, ${data.name}!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${data.url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">If you did not request this email, please ignore it.</p>
        <p style="font-size: 12px; color: #777;">Your verification token is: <strong>${data.token}</strong></p>
      </div>
    `,
    text: `Welcome ${data.name}! Please verify your email by visiting ${data.url}. Your token is: ${data.token}`,
  };
};
