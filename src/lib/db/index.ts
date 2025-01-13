import { sql } from '@vercel/postgres';
import { Article } from '@/utils/telegram/types';
import { ChannelConfig } from '@/utils/telegram/channelConfig';
import { DbArticle, mapDbArticleToContentItem, ContentItem } from './types';

export async function saveChannel(channel: ChannelConfig) {
  try {
    await sql`
      INSERT INTO channels (
        username, name, category, language, description, 
        tags, update_frequency, quality
      ) VALUES (
        ${channel.username}, ${channel.name}, ${channel.category}, 
        ${channel.language}, ${channel.description}, ${channel.tags}::text[], 
        ${channel.updateFrequency}, ${channel.quality}
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
        last_scraped = CURRENT_TIMESTAMP;
    `;
  } catch (error) {
    console.error(`Error saving channel ${channel.username}:`, error);
    throw error;
  }
}

export async function saveArticle(article: Article, channelUsername: string) {
  const id = `${article.source}-${article.publishDate.getTime()}`;
  const excerpt = article.content.slice(0, 150) + '...';

  try {
    await sql`
      INSERT INTO articles (
        id, title, content, excerpt, category, source, url,
        publish_date, views, language, tags, channel_username
      ) VALUES (
        ${id}, ${article.title}, ${article.content}, ${excerpt},
        ${article.category}, ${article.source}, ${article.url},
        ${article.publishDate.toISOString()}, ${article.views}, ${article.language},
        ${article.tags}::text[], ${channelUsername}
      )
      ON CONFLICT (id) 
      DO UPDATE SET
        views = EXCLUDED.views,
        updated_at = CURRENT_TIMESTAMP;
    `;
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
    let query = sql`
      SELECT * FROM articles
      WHERE 1=1
    `;

    if (category) {
      query = sql`${query} AND category = ${category}`;
    }

    if (language) {
      query = sql`${query} AND language = ${language}`;
    }

    const { rows } = await sql`
      ${query}
      ORDER BY publish_date DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

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
    const { rows } = await sql`
      SELECT * FROM articles
      WHERE channel_username = ${channelUsername}
      ORDER BY publish_date DESC
      LIMIT ${limit}
    `;
    return (rows as DbArticle[]).map(mapDbArticleToContentItem);
  } catch (error) {
    console.error(`Error fetching articles for channel ${channelUsername}:`, error);
    throw error;
  }
}

export async function updateArticleViews(id: string) {
  try {
    await sql`
      UPDATE articles
      SET views = views + 1
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(`Error updating views for article ${id}:`, error);
    throw error;
  }
} 