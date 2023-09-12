import { ConfigFactory } from '@nestjs/config';

export const AppConfig: ConfigFactory = () => ({
  port: process.env.PORT || 3000,
  appPrefix: '/api/v1',
  database: {
    type: 'mongodb',
    url: process.env.DATABASE_URL,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    successUrl: process.env.STRIPE_SUCCESS_URL,
    cancelUrl: process.env.STRIPE_CANCEL_URL,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '60m' },
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    folderPath: 'cloudinary/assets/',
    publicId_prefix: 'partyx_prods_',
    bigSize: '400X400',
  },
  google: {
    PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    BASE_URL:
      process.env.GOOGLE_PLACES_BASE_URL ||
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
  },

  // ...other environment variables
});
