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
  exportSwagger: string | undefined;
  r2: {
    accountId: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
    publicUrl: string;
  };
  supabase: {
    url: string;
    key: string;
    bucket: string;
  };
  storageProvider: 'r2' | 'supabase';
  media: {
    maxFileSize: number;
    allowedMimeTypes: string[];
    tempFileExpirationHours: number;
  };
  mail: {
    provider: 'nodemailer' | 'sendgrid' | 'ses';
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  };
  social: {
    google: {
      clientId: string;
    };
    facebook: {
      appId: string;
      appSecret: string;
    };
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
    SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: supabaseKey,
    SUPABASE_BUCKET: supabaseBucket,
    STORAGE_PROVIDER: storageProvider,
    SMTP_HOST: smtpHost,
    SMTP_PORT: smtpPort,
    SMTP_USER: smtpUser,
    SMTP_PASS: smtpPass,
    SMTP_FROM: smtpFrom,
    MAIL_PROVIDER: mailProvider,
    GOOGLE_CLIENT_ID: googleClientId,
    FACEBOOK_APP_ID: facebookAppId,
    FACEBOOK_APP_SECRET: facebookAppSecret,
    EXPORT_SWAGGER: exportSwagger,
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
    exportSwagger,
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
    supabase: {
      url: supabaseUrl || '',
      key: supabaseKey || '',
      bucket: supabaseBucket || 'media-public',
    },
    storageProvider: (storageProvider as 'r2' | 'supabase') || 'r2',
    media: {
      maxFileSize: Number(process.env.MEDIA_MAX_FILE_SIZE) || 50 * 1024 * 1024, // 50MB
      tempFileExpirationHours:
        Number(process.env.MEDIA_TEMP_FILE_EXPIRATION_HOURS) || 24,
      allowedMimeTypes: process.env.MEDIA_ALLOWED_MIME_TYPES
        ? process.env.MEDIA_ALLOWED_MIME_TYPES.split(',')
        : [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'video/mp4',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
          ],
    },
    mail: {
      provider:
        (mailProvider as 'nodemailer' | 'sendgrid' | 'ses') || 'nodemailer',
      host: smtpHost || '',
      port: Number(smtpPort) || 587,
      user: smtpUser || '',
      pass: smtpPass || '',
      from: smtpFrom || '"E-Commerce Support" <support@example.com>',
    },
    social: {
      google: {
        clientId: googleClientId || '',
      },
      facebook: {
        appId: facebookAppId || '',
        appSecret: facebookAppSecret || '',
      },
    },
  };
};

export const config = getConfig();
