import { loadEnv, validateEnv } from '../lib/env';
import { createTables } from '../lib/db/schema';
import { logger } from '../services/scraper/logger';

async function main() {
  try {
    // Load environment variables
    loadEnv();
    validateEnv();

    // Debug environment variables
    console.log('Environment variables loaded:');
    console.log('POSTGRES_URL:', process.env.POSTGRES_URL);
    console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
    console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);

    // Create database tables
    await createTables();
    logger.info('✅ Database initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize database: ${error}`);
    process.exit(1);
  }
}

main(); 