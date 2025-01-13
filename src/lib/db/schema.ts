import { sql } from '@vercel/postgres';

export async function createTables() {
  try {
    // Create channels table
    await sql`
      CREATE TABLE IF NOT EXISTS channels (
        username VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        language VARCHAR(10) NOT NULL,
        description TEXT,
        tags TEXT[],
        update_frequency VARCHAR(50),
        quality VARCHAR(50),
        last_scraped TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create articles table
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category VARCHAR(50) NOT NULL,
        source VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        publish_date TIMESTAMP WITH TIME ZONE NOT NULL,
        views INTEGER DEFAULT 0,
        language VARCHAR(10) NOT NULL,
        tags TEXT[],
        channel_username VARCHAR(255) REFERENCES channels(username),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create index on publish_date for faster sorting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date DESC);
    `;

    // Create index on category and language for faster filtering
    await sql`
      CREATE INDEX IF NOT EXISTS idx_articles_category_language ON articles(category, language);
    `;

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
} 