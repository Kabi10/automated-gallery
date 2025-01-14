import { sql } from '@vercel/postgres';
import { Article } from '@/services/scraper/telegram/types';
import { ChannelConfig } from '@/utils/telegram/channelConfig';
import { DbArticle, mapDbArticleToContentItem, ContentItem } from './types';

export async function saveChannel(channel: ChannelConfig) {
  try {
    const tagsArray = `{${channel.tags.map(tag => `"${tag}"`).join(',')}}`;
    
    await sql.query(`
      INSERT INTO channels (
        username, name, category, language, description, 
        tags, update_frequency, quality
      ) VALUES (
        $1, $2, $3, $4, $5, $6::text[], $7, $8
      )
      ON CONFLICT (username) 
      DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        language = EXCLUDED.language,
        description = EXCLUDED.description,
        tags = EXCLUDED.tags,
        update_frequency = EXCLUDED.update_frequency,
        quality = EXCLUDED.quality,
        last_scraped = CURRENT_TIMESTAMP
    `, [
      channel.username,
      channel.name,
      channel.category,
      channel.language,
      channel.description,
      channel.tags,
      channel.updateFrequency,
      channel.quality
    ]);
  } catch (error) {
    console.error(`Error saving channel ${channel.username}:`, error);
    throw error;
  }
}

export async function saveArticle(article: Article, channelUsername: string) {
  const id = `${article.source}-${article.publishDate.getTime()}`;
  const excerpt = article.content.slice(0, 150) + '...';

  try {
    await sql.query(`
      INSERT INTO articles (
        id, title, content, excerpt, category, source, url,
        publish_date, views, language, tags, channel_username
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::text[], $12
      )
      ON CONFLICT (id) 
      DO UPDATE SET
        views = EXCLUDED.views,
        updated_at = CURRENT_TIMESTAMP
    `, [
      id,
      article.title,
      article.content,
      excerpt,
      article.category,
      article.source,
      article.url,
      article.publishDate.toISOString(),
      article.views,
      article.language,
      article.tags,
      channelUsername
    ]);
  } catch (error) {
    console.error(`Error saving article ${id}:`, error);
    throw error;
  }
}

export async function getLatestArticles(
  limit: number = 30,
  offset: number = 0,
  category?: string,
  language?: string
): Promise<ContentItem[]> {
  try {
    let conditions = [];
    let params: (string | number)[] = [limit, offset];
    let paramCount = 3;

    if (category) {
      conditions.push(`category = $${paramCount}`);
      params.push(category);
      paramCount++;
    }
    
    if (language) {
      conditions.push(`language = $${paramCount}`);
      params.push(language);
    }

    const whereClause = conditions.length > 0 
      ? 'WHERE ' + conditions.join(' AND ')
      : '';

    const queryText = `
      SELECT * FROM articles
      ${whereClause}
      ORDER BY publish_date DESC
      LIMIT $1::integer
      OFFSET $2::integer
    `;

    const { rows } = await sql.query(queryText, params);
    return (rows as DbArticle[]).map(mapDbArticleToContentItem);
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
}

export async function getArticlesByChannel(
  channelUsername: string,
  limit: number = 10
): Promise<ContentItem[]> {
  try {
    const { rows } = await sql.query(`
      SELECT * FROM articles
      WHERE channel_username = $1
      ORDER BY publish_date DESC
      LIMIT $2
    `, [channelUsername, limit]);
    
    return (rows as DbArticle[]).map(mapDbArticleToContentItem);
  } catch (error) {
    console.error(`Error fetching articles for channel ${channelUsername}:`, error);
    throw error;
  }
}

export async function updateArticleViews(id: string) {
  try {
    await sql.query(`
      UPDATE articles
      SET views = views + 1
      WHERE id = $1
    `, [id]);
  } catch (error) {
    console.error(`Error updating views for article ${id}:`, error);
    throw error;
  }
} 