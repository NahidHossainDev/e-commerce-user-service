import * as dotenv from 'dotenv';
import { install } from 'source-map-support';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
install({
  environment: 'node',
  handleUncaughtExceptions: true,
  hookRequire: true,
});

export interface Config {
  port: number;
  env: string;
  dbURL: string;
  natsURL: string;
  jwtSecretKey: string;
  jwtExpire: string;
  redisHost: string;
  redisPort: number;
  saltRound: number;
}

dotenv.config();

const getConfig = (): Config => {
  const {
    DATABASE_URL: dbURL,
    PORT,
    NODE_ENV: env,
    JWT_SECRET_KEY: jwtSecretKey,
    JWT_EXPIRE_LIMIT: jwtExpire,
    REDIS_PORT: redisPort,
    REDIS_HOST: redisHost,
    NATS_URL: natsURL,
    SALT_ROUND: saltRound,
  } = process.env;

  if (!dbURL) throw new Error('DataBase url is required');
  if (!env) throw new Error('ENV is required');
  if (!natsURL) throw new Error('NATS URL is required');
  if (!jwtSecretKey) throw new Error('jwtSecretKey is required');
  if (!jwtExpire) throw new Error('jwtExpire is required');
  if (!redisHost) throw new Error('Redis Host is missing');
  if (!redisPort) throw new Error('Redis Port is missing');

  return {
    dbURL,
    port: Number(PORT),
    env,
    natsURL,
    jwtSecretKey,
    jwtExpire,
    redisHost,
    redisPort: Number(redisPort),
    saltRound: Number(saltRound),
  };
};

export const config = getConfig();
