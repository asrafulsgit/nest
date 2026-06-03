// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  apiPrefix : process.env.API_PREFIX,
  hashSalt : Number(process.env.HASH_SALT)
}));
 