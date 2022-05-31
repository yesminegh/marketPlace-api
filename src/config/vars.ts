import { config } from 'dotenv';

config();

export const env = process.env.NODE_ENV;
export const port = process.env.PORT;
export const mongoUri = process.env.MONGO_URI as string;
export const clientUrl = process.env.CLIENT_URL;
export const shopUrl = process.env.SHOP_URL;
export const serverUrl = process.env.SERVER_URL;
export const accessSecret = process.env.ACCESS_SECRET as string;
export const expirationInterval = Number(process.env.JWT_EXPIRATION_MINUTES);
export const accountSid = process.env.TWILIO_ACCOUNT_SID;
export const authToken = process.env.TWILIO_AUTH_TOKEN;
export const facebookId = process.env.FACEBOOK_CLIENT_ID;
export const facebookSecret = process.env.FACEBOOK_APP_SECRET;
export const googleId = process.env.GOOGLE_CLIENT_ID;
export const googleSecret = process.env.GOOGLE_APP_SECRET;
export const s3Url = process.env.S3_URL;
export const bucketName = process.env.BUCKET_NAME;
export const MINIO_SERVER = process.env.MINIO_SERVER;
export const SMS_API_KEY = process.env.SMS_API_KEY;
