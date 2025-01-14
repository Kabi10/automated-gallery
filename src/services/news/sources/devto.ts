import axios from 'axios';
import { NewsItem } from '../types';

const DEV_API_BASE = 'https://dev.to/api';

export async function fetchDevToArticles(limit: number = 30): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${DEV_API_BASE}/articles`, {
      params: {
        per_page: limit,
        top: 1
      }
    });

    return response.data.map((article: any) => ({
      id: `devto-${article.id}`,
      title: article.title,
      url: article.url,
      content: article.body_markdown,
      summary: article.description,
      publishDate: new Date(article.published_at),
      source: 'devto' as const,
      score: article.public_reactions_count,
      category: categorizeDevToArticle(article),
      tags: article.tag_list
    }));
  } catch (error) {
    console.error('Error fetching from Dev.to:', error);
    return [];
  }
}

export async function searchDevTo(query: string, limit: number = 30): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${DEV_API_BASE}/articles/search`, {
      params: {
        q: query,
        per_page: limit
      }
    });

    return response.data.map((article: any) => ({
      id: `devto-${article.id}`,
      title: article.title,
      url: article.url,
      content: article.body_markdown,
      summary: article.description,
      publishDate: new Date(article.published_at),
      source: 'devto' as const,
      score: article.public_reactions_count,
      category: categorizeDevToArticle(article),
      tags: article.tag_list
    }));
  } catch (error) {
    console.error('Error searching Dev.to:', error);
    return [];
  }
}

function categorizeDevToArticle(article: any): string {
  const tags = article.tag_list.map((tag: string) => tag.toLowerCase());
  
  if (tags.some(tag => ['ai', 'machinelearning', 'artificialintelligence'].includes(tag))) {
    return 'ai';
  }
  if (tags.some(tag => ['startup', 'entrepreneurship', 'business'].includes(tag))) {
    return 'startup';
  }
  if (tags.some(tag => ['programming', 'coding', 'development'].includes(tag))) {
    return 'development';
  }
  if (tags.some(tag => ['security', 'infosec', 'privacy'].includes(tag))) {
    return 'security';
  }
  if (tags.some(tag => ['blockchain', 'crypto', 'web3'].includes(tag))) {
    return 'blockchain';
  }
  
  return 'technology';
} 