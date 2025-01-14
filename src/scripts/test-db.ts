import { Pool } from 'pg';
import { loadEnv, validateEnv } from '../lib/env';
import { logger } from '../services/scraper/logger';

async function main() {
  try {
    // Load environment variables
    loadEnv();
    validateEnv();

    // Create a new pool
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URL_NON_POOLING,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Test database connection
    const result = await pool.query('SELECT NOW();');
    logger.info(`✅ Database connection successful: ${JSON.stringify(result.rows[0])}`);
    
    // Close the pool
    await pool.end();
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
    process.exit(1);
  }
}

main(); 