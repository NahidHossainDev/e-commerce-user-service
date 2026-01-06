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

export const AUTH_EVENTS = {
  USER_REGISTERED: 'user.registered',
  USER_RESEND_VERIFICATION: 'user.resend_verification',
};
