import axios from 'axios';
import { NewsItem } from '../../types';

const DEV_API_BASE = 'https://dev.to/api';

function categorizeDevToArticle(tags: string[]): string {
  if (tags.some(tag => ['ai', 'machinelearning', 'artificialintelligence'].includes(tag))) {
    return 'AI/ML';
  }
  if (tags.some(tag => ['blockchain', 'crypto', 'bitcoin', 'web3'].includes(tag))) {
    return 'Blockchain';
  }
  if (tags.some(tag => ['startup', 'entrepreneurship', 'business'].includes(tag))) {
    return 'Startups';
  }
  if (tags.some(tag => ['security', 'infosec', 'privacy'].includes(tag))) {
    return 'Security';
  }
  if (tags.some(tag => ['programming', 'coding', 'development'].includes(tag))) {
    return 'Programming';
  }
  return 'Technology';
}

export async function fetchDevToArticles(limit: number = 30): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${DEV_API_BASE}/articles`, {
      params: {
        per_page: limit,
        top: 1
      }
    });

    return response.data.map((article: any): NewsItem => {
      const newsItem: NewsItem = {
        id: String(article.id),
        title: article.title,
        url: article.url,
        publishDate: new Date(article.published_at).toISOString(),
        source: 'devto',
        score: article.public_reactions_count || 0,
        tags: article.tag_list || [],
        category: categorizeDevToArticle(article.tag_list || [])
      };

      if (article.description) {
        newsItem.content = article.description;
      }

      return newsItem;
    });
  } catch (error) {
    console.error('Error fetching Dev.to articles:', error);
    return [];
  }
}

export async function searchDevTo(query: string): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${DEV_API_BASE}/articles/search`, {
      params: {
        q: query
      }
    });

    return response.data.map((article: any): NewsItem => {
      const newsItem: NewsItem = {
        id: String(article.id),
        title: article.title,
        url: article.url,
        publishDate: new Date(article.published_at).toISOString(),
        source: 'devto',
        score: article.public_reactions_count || 0,
        tags: article.tag_list || [],
        category: categorizeDevToArticle(article.tag_list || [])
      };

      if (article.description) {
        newsItem.content = article.description;
      }

      return newsItem;
    });
  } catch (error) {
    console.error('Error searching Dev.to:', error);
    return [];
  }
} 