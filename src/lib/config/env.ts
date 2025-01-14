import { z } from 'zod'

// Environment variable schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Database
  POSTGRES_URL: z.string().url(),
  
  // API
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  API_TOKEN: z.string().min(1).optional(),
  
  // Telegram
  TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
  
  // AI Services
  OPENAI_API_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  
  // Analytics
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

// Process environment variables
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_URL: process.env.POSTGRES_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_TOKEN: process.env.API_TOKEN,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
}

// Validate and export environment variables
const env = envSchema.parse(processEnv)

export default env

// Export individual environment variables with types
export const {
  NODE_ENV,
  POSTGRES_URL,
  NEXT_PUBLIC_API_BASE_URL,
  API_TOKEN,
  TELEGRAM_BOT_TOKEN,
  OPENAI_API_KEY,
  GEMINI_API_KEY,
  NEXT_PUBLIC_ANALYTICS_ID,
} = env

// Environment type
export type Env = z.infer<typeof envSchema>

// Environment helpers
export const isDevelopment = NODE_ENV === 'development'
export const isProduction = NODE_ENV === 'production'
export const isTest = NODE_ENV === 'test' 