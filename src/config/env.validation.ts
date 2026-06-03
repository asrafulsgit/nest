import { z } from 'zod';

const zodObject = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('5000'),
  API_PREFIX: z.string(),
  DATABASE_URL: z.string(),
  HASH_SALT: z.string(),
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRES: z.string(),
});

export type EnvConfig = z.infer<typeof zodObject>;

export function validate(config: Record<string, unknown>) {
  const result = zodObject.safeParse(config);
  if (!result.success) {
    throw new Error(`Config validation failed:\n${result.error.message}`);
  }
  return result.data;
}
