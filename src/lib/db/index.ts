import { createPool } from '@vercel/postgres';
import { Article } from '../../services/scraper/telegram/types';
import { logger } from '../../services/scraper/logger';

export async function saveArticle(article: Article, channelUsername: string) {
  try {
    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    const tagsArray = `{${article.tags.map(tag => `"${tag}"`).join(',')}}`;
    const { rows } = await pool.query(
      `INSERT INTO articles (
        id,
        title,
        content,
        excerpt,
        category,
        source,
        url,
        publish_date,
        language,
        tags,
        channel_username
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        excerpt = EXCLUDED.excerpt,
        category = EXCLUDED.category,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;`,
      [
        article.url,
        article.title,
        article.content,
        article.excerpt || '',
        article.category,
        'telegram',
        article.url,
        new Date(article.publishDate).toISOString(),
        article.language,
        tagsArray,
        channelUsername
      ]
    );
    
    logger.info(`✅ Saved article: ${article.title}`);
    return rows[0];
  } catch (error) {
    logger.error(`Error saving article ${article.url}: ${error}`);
    throw error;
  }
}

export async function getArticles(options: {
  category?: string;
  language?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, language, limit = 10, offset = 0 } = options;
  
  try {
    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    const params = [];
    const conditions = [];
    
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    
    if (language) {
      params.push(language);
      conditions.push(`language = $${params.length}`);
    }
    
    params.push(limit, offset);
    
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';
    
    const { rows } = await pool.query(
      `SELECT * FROM articles
      ${whereClause}
      ORDER BY publish_date DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}`,
      params
    );
    
    return rows;
  } catch (error) {
    logger.error(`Error fetching articles: ${error}`);
    throw error;
  }
} 