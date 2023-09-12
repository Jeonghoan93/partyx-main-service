import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

const config = new ConfigService();

export const generateAuthToken = (id: string) => {
  return jwt.sign({ id }, config.get('jwt.secret'), {
    expiresIn: '30d',
  });
};

export const decodeAuthToken = (token: string) => {
  try {
    return jwt.verify(token, config.get('jwt.secret'));
  } catch (err) {
    console.error('Error in decodeAuthToken: ', err.message);
    throw new Error(err);
  }
};
