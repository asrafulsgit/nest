// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV,
}));
