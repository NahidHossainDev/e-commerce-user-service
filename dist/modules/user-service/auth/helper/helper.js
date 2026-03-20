"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = exports.generateHash = exports.generateRandomPassword = void 0;
const crypto_1 = require("crypto");
const generateRandomPassword = () => {
    return crypto_1.default.randomBytes(16).toString('hex');
};
exports.generateRandomPassword = generateRandomPassword;
const generateHash = (otpOrToken) => {
    return crypto_1.default.createHash('sha256').update(otpOrToken).digest('hex');
};
exports.generateHash = generateHash;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=helper.js.map