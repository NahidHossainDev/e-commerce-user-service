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
  r2: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
  };
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
    R2_ACCOUNT_ID: r2AccountId,
    R2_ACCESS_KEY_ID: r2AccessKeyId,
    R2_SECRET_ACCESS_KEY: r2SecretAccessKey,
    R2_BUCKET_NAME: r2BucketName,
    R2_PUBLIC_URL: r2PublicUrl,
  } = process.env;

  if (!dbURL) throw new Error('DataBase url is required');
  if (!env) throw new Error('ENV is required');
  if (!natsURL) throw new Error('NATS URL is required');
  if (!jwtSecretKey) throw new Error('jwtSecretKey is required');
  if (!jwtExpire) throw new Error('jwtExpire is required');
  if (!redisHost) throw new Error('Redis Host is missing');
  if (!redisPort) throw new Error('Redis Port is missing');

  if (
    !r2AccountId ||
    !r2AccessKeyId ||
    !r2SecretAccessKey ||
    !r2BucketName ||
    !r2PublicUrl
  ) {
    throw new Error('R2 configuration is incomplete');
  }

  return {
    dbURL,
    port: Number(PORT),
    env,
    natsURL,
    jwtSecretKey,
    jwtExpire: jwtExpire || '1h',
    redisHost,
    redisPort: Number(redisPort),
    saltRound: Number(saltRound),
    r2: {
      accountId: r2AccountId,
      accessKeyId: r2AccessKeyId,
      secretAccessKey: r2SecretAccessKey,
      bucketName: r2BucketName,
      publicUrl: r2PublicUrl,
    },
  };
};

export const config = getConfig();
