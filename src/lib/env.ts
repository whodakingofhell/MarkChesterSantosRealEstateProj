import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('Philippine Skyland'),
  NEXT_PUBLIC_APP_VERSION: z.string().min(1).default('1.0.0'),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().min(1).default('7d'),
  SMTP_HOST: z.string().min(1).default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().default('nelsonaczon@gmail.com'),
  SMTP_PASS: z.string().default('not-configured'),
  SMTP_FROM: z.string().min(1).default('Philippine Skyland <nelsonaczon@gmail.com>'),
  STORAGE_TYPE: z.enum(['local', 's3', 'minio']).default('local'),
  STORAGE_BUCKET: z.string().min(1).default('uploads'),
  STORAGE_ACCESS_KEY: z.string().default('dev'),
  STORAGE_SECRET_KEY: z.string().default('dev'),
  STORAGE_REGION: z.string().default('ap-southeast-1'),
  TURNSTILE_SECRET_KEY: z.string().default(''),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default(''),
  HMAC_SECRET: z.string().min(16),
  SENTRY_DSN: z.string().optional().default(''),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  BACKUP_DIR: z.string().default('./backups'),
  BACKUP_RETENTION_DAYS: z.coerce.number().int().positive().default(30),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function validateEnv(): Env {
  if (cachedEnv) return cachedEnv;
  
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.warn('⚠️  Environment variable warnings:', result.error.flatten().fieldErrors);
    // Use defaults instead of crashing
    cachedEnv = envSchema.parse({});
    return cachedEnv;
  }
  
  cachedEnv = result.data;
  return cachedEnv;
}

if (typeof window === 'undefined') {
  validateEnv();
}
