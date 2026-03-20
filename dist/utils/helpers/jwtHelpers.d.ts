import { JwtPayload, Secret } from 'jsonwebtoken';
export declare const jwtHelpers: {
    createToken: (payload: Record<string, unknown>, secret: Secret) => string;
    verifyToken: (token: string, secret: Secret) => JwtPayload;
};
