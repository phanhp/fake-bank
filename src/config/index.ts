export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  appEnv: process.env.APP_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DB_URL,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expireTime: process.env.EXPIRE_TIME,
  },
  facebook: {
    id: process.env.FB_APP_ID,
    secret: process.env.FB_APP_SECRET,
  },
  google: {
    id: process.env.GOOGLE_ID,
    secret: process.env.GOOGLE_SECRET,
  },
  apple: {
    id: process.env.APPLE_ID,
  },
  sendgrid: process.env.SENDGRID_KEY,
  s3: {
    bucket: process.env.BUCKET_NAME,
    url: process.env.BUCKET_URL,
  },
  twilio: {
    accountId: process.env.TWILIO_ID,
    token: process.env.TWILIO_TOKEN,
    senderPhone: process.env.TWILIO_SENDER_PHONE,
  },
});

export const WhiteListPhonenumbers = ['84785705892'];
