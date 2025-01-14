import axios from 'axios';
import { NewsItem } from '../types';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const HN_ALGOLIA_API = 'https://hn.algolia.com/api/v1';

export async function fetchHackerNews(limit: number = 30): Promise<NewsItem[]> {
  try {
    // Fetch top stories from HN
    const response = await axios.get(`${HN_API_BASE}/topstories.json`);
    const storyIds = response.data.slice(0, limit);

    // Fetch story details in parallel
    const stories = await Promise.all(
      storyIds.map(async (id: number) => {
        const storyResponse = await axios.get(`${HN_API_BASE}/item/${id}.json`);
        const story = storyResponse.data;

        return {
          id: `hn-${story.id}`,
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          publishDate: new Date(story.time * 1000),
          source: 'hackernews' as const,
          score: story.score,
          category: categorizeHNStory(story.title),
          tags: extractTags(story.title),
          summary: story.text || undefined
        };
      })
    );

    return stories.filter(story => story.url && story.title);
  } catch (error) {
    console.error('Error fetching from Hacker News:', error);
    return [];
  }
}

export async function searchHackerNews(query: string, limit: number = 30): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${HN_ALGOLIA_API}/search`, {
      params: {
        query,
        tags: 'story',
        hitsPerPage: limit
      }
    });

    return response.data.hits.map((hit: any) => ({
      id: `hn-${hit.objectID}`,
      title: hit.title,
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      publishDate: new Date(hit.created_at),
      source: 'hackernews' as const,
      score: hit.points,
      category: categorizeHNStory(hit.title),
      tags: extractTags(hit.title)
    }));
  } catch (error) {
    console.error('Error searching Hacker News:', error);
    return [];
  }
}

function categorizeHNStory(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('gpt')) {
    return 'ai';
  }
  if (lowerTitle.includes('startup') || lowerTitle.includes('launch')) {
    return 'startup';
  }
  if (lowerTitle.includes('programming') || lowerTitle.includes('code') || lowerTitle.includes('dev')) {
    return 'development';
  }
  if (lowerTitle.includes('security') || lowerTitle.includes('hack')) {
    return 'security';
  }
  if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto')) {
    return 'blockchain';
  }
  
  return 'technology';
}

function extractTags(title: string): string[] {
  const tags = new Set<string>();
  const lowerTitle = title.toLowerCase();
  
  // Common tech keywords
  const keywords = [
    'ai', 'ml', 'python', 'javascript', 'rust', 'golang',
    'blockchain', 'crypto', 'web3', 'startup', 'cloud',
    'aws', 'azure', 'google', 'api', 'opensource', 'github'
  ];
  
  keywords.forEach(keyword => {
    if (lowerTitle.includes(keyword)) {
      tags.add(keyword);
    }
  });
  
  return Array.from(tags);
} 