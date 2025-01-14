import axios from 'axios';
import { NewsItem } from '../../types';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';
const HN_ITEM_URL = (id: number) => `${HN_API_BASE}/item/${id}.json`;
const HN_TOP_STORIES_URL = `${HN_API_BASE}/topstories.json`;
const HN_SEARCH_URL = 'https://hn.algolia.com/api/v1/search';

function categorizeHNStory(title: string): string {
  title = title.toLowerCase();
  
  if (title.includes('ai') || title.includes('machine learning') || title.includes('neural')) {
    return 'AI/ML';
  }
  if (title.includes('blockchain') || title.includes('crypto') || title.includes('bitcoin')) {
    return 'Blockchain';
  }
  if (title.includes('startup') || title.includes('funding') || title.includes('venture')) {
    return 'Startups';
  }
  if (title.includes('security') || title.includes('hack') || title.includes('vulnerability')) {
    return 'Security';
  }
  if (title.includes('programming') || title.includes('code') || title.includes('developer')) {
    return 'Programming';
  }
  
  return 'Technology';
}

function extractTags(title: string): string[] {
  const tags = new Set<string>();
  const words = title.toLowerCase().split(/\W+/);
  
  const techKeywords = [
    'ai', 'ml', 'api', 'cloud', 'data', 'web', 'app', 'mobile',
    'security', 'crypto', 'blockchain', 'startup', 'programming'
  ];
  
  words.forEach(word => {
    if (techKeywords.includes(word)) {
      tags.add(word);
    }
  });
  
  return Array.from(tags);
}

export async function fetchHackerNews(limit: number = 30): Promise<NewsItem[]> {
  try {
    // Fetch top story IDs
    const response = await axios.get<number[]>(HN_TOP_STORIES_URL);
    const storyIds = response.data.slice(0, limit);
    
    // Fetch story details in parallel
    const stories = await Promise.all(
      storyIds.map(async (id) => {
        try {
          const storyResponse = await axios.get(HN_ITEM_URL(id));
          const story = storyResponse.data;
          
          if (!story || !story.title) return null;
          
          const newsItem: NewsItem = {
            id: String(story.id),
            title: story.title,
            url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
            publishDate: new Date(story.time * 1000).toISOString(),
            source: 'hackernews',
            score: story.score || 0,
            tags: extractTags(story.title),
            category: categorizeHNStory(story.title)
          };

          if (story.text) {
            newsItem.content = story.text;
          }
          
          return newsItem;
        } catch (error) {
          console.error(`Error fetching HN story ${id}:`, error);
          return null;
        }
      })
    );
    
    return stories.filter((story): story is NewsItem => story !== null);
  } catch (error) {
    console.error('Error fetching HN stories:', error);
    return [];
  }
}

export async function searchHackerNews(query: string): Promise<NewsItem[]> {
  try {
    const response = await axios.get(HN_SEARCH_URL, {
      params: {
        query,
        tags: 'story'
      }
    });
    
    return response.data.hits.map((hit: any): NewsItem => {
      const newsItem: NewsItem = {
        id: String(hit.objectID),
        title: hit.title,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        publishDate: new Date(hit.created_at).toISOString(),
        source: 'hackernews',
        score: hit.points || 0,
        tags: extractTags(hit.title),
        category: categorizeHNStory(hit.title)
      };

      if (hit.story_text) {
        newsItem.content = hit.story_text;
      }

      return newsItem;
    });
  } catch (error) {
    console.error('Error searching HN:', error);
    return [];
  }
} 