import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
export function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  console.log('Loading environment variables from:', envPath);
  const result = config({ path: envPath });
  console.log('Dotenv config result:', result);
  
  // Debug loaded variables
  console.log('Environment variables after loading:');
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL);
  console.log('POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING);
}

// Validate required environment variables
export function validateEnv() {
  const requiredEnvVars = [
    'POSTGRES_URL',
    'POSTGRES_PRISMA_URL',
    'SUPABASE_URL',
    'POSTGRES_URL_NON_POOLING',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'POSTGRES_HOST'
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
} 