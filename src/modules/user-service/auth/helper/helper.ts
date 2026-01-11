import crypto from 'crypto';

export const generateRandomPassword = (): string => {
  return crypto.randomBytes(16).toString('hex');
};

export const generateHash = (otpOrToken: string): string => {
  return crypto.createHash('sha256').update(otpOrToken).digest('hex');
};

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit numeric OTP
};
