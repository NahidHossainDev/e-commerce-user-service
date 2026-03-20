export declare class UserRegisteredEvent {
    readonly userId: string;
    readonly email: string;
    readonly rawVerificationToken: string;
    readonly fullName: string;
    constructor(userId: string, email: string, rawVerificationToken: string, fullName: string);
}
export declare class UserResendVerificationEvent {
    readonly userId: string;
    readonly email: string;
    readonly rawVerificationToken: string;
    readonly fullName: string;
    constructor(userId: string, email: string, rawVerificationToken: string, fullName: string);
}
export declare class PhoneOtpRequestedEvent {
    readonly phoneNumber: string;
    readonly rawOtp: string;
    constructor(phoneNumber: string, rawOtp: string);
}
export declare const AUTH_EVENTS: {
    USER_REGISTERED: string;
    USER_RESEND_VERIFICATION: string;
    PHONE_OTP_REQUESTED: string;
};
