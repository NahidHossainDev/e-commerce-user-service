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
export declare const config: Config;
