"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_EVENTS = exports.PhoneOtpRequestedEvent = exports.UserResendVerificationEvent = exports.UserRegisteredEvent = void 0;
class UserRegisteredEvent {
    userId;
    email;
    rawVerificationToken;
    fullName;
    constructor(userId, email, rawVerificationToken, fullName) {
        this.userId = userId;
        this.email = email;
        this.rawVerificationToken = rawVerificationToken;
        this.fullName = fullName;
    }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
class UserResendVerificationEvent {
    userId;
    email;
    rawVerificationToken;
    fullName;
    constructor(userId, email, rawVerificationToken, fullName) {
        this.userId = userId;
        this.email = email;
        this.rawVerificationToken = rawVerificationToken;
        this.fullName = fullName;
    }
}
exports.UserResendVerificationEvent = UserResendVerificationEvent;
class PhoneOtpRequestedEvent {
    phoneNumber;
    rawOtp;
    constructor(phoneNumber, rawOtp) {
        this.phoneNumber = phoneNumber;
        this.rawOtp = rawOtp;
    }
}
exports.PhoneOtpRequestedEvent = PhoneOtpRequestedEvent;
exports.AUTH_EVENTS = {
    USER_REGISTERED: 'user.registered',
    USER_RESEND_VERIFICATION: 'user.resend_verification',
    PHONE_OTP_REQUESTED: 'auth.phone_otp_requested',
};
//# sourceMappingURL=auth.events.js.map