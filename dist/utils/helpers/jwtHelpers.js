"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jwt = require("jsonwebtoken");
const config_1 = require("../../config");
const createToken = (payload, secret) => {
    return jwt.sign(payload, secret, {
        expiresIn: Number(config_1.config.jwtExpire),
    });
};
const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
};
//# sourceMappingURL=jwtHelpers.js.map