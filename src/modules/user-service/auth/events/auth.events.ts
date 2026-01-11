export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly rawVerificationToken: string,
    public readonly fullName: string,
  ) {}
}

export class UserResendVerificationEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly rawVerificationToken: string,
    public readonly fullName: string,
  ) {}
}

export class PhoneOtpRequestedEvent {
  constructor(
    public readonly phoneNumber: string,
    public readonly rawOtp: string,
  ) {}
}

export const AUTH_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_RESEND_VERIFICATION: 'user.resend_verification',
  PHONE_OTP_REQUESTED: 'auth.phone_otp_requested',
};
