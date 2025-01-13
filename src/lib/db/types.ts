import { QueryResultRow } from '@vercel/postgres';

export interface DbArticle extends QueryResultRow {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  source: string;
  url: string;
  publish_date: Date;
  views: number;
  language: string;
  tags: string[];
  channel_username: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  source: string;
  url: string;
  publishDate: Date;
  views: number;
  language: string;
}

export function mapDbArticleToContentItem(dbArticle: DbArticle): ContentItem {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    excerpt: dbArticle.excerpt,
    category: dbArticle.category,
    tags: dbArticle.tags,
    source: dbArticle.source,
    url: dbArticle.url,
    publishDate: dbArticle.publish_date,
    views: dbArticle.views,
    language: dbArticle.language
  };
} 