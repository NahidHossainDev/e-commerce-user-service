import * as jwt from 'jsonwebtoken';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { config } from 'src/config';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
): string => {
  // jwt.sign returns a string when no callback is provided; assert as string for type safety
  return jwt.sign(payload, secret, {
    expiresIn: Number(config.jwtExpire),
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
