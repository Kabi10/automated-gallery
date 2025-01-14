import { Pool } from 'pg'
import { sql } from '@vercel/postgres'
import { logger } from '../config/logger'

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
})

// Query helper with error handling
export async function query<T>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const start = Date.now()
    const result = await pool.query(text, params)
    const duration = Date.now() - start

    logger.info(`Executed query: ${text}`)
    logger.info(`Duration: ${duration}ms, Rows: ${result.rowCount}`)

    return result.rows
  } catch (error) {
    logger.error(`Database query error: ${error}`)
    throw error
  }
}

// Vercel Edge Function compatible query helper
export async function edgeQuery<T>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const start = Date.now()
    const result = await sql.query(text, params)
    const duration = Date.now() - start

    logger.info(`Executed edge query: ${text}`)
    logger.info(`Duration: ${duration}ms, Rows: ${result.rowCount}`)

    return result.rows
  } catch (error) {
    logger.error(`Database edge query error: ${error}`)
    throw error
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: Pool) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export default {
  query,
  edgeQuery,
  transaction,
  pool,
} 