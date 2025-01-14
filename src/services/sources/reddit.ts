import axios from 'axios';
import { NewsItem } from '../../types';

const REDDIT_API_BASE = 'https://www.reddit.com';
const SUBREDDITS = ['technology', 'programming', 'artificial', 'startups', 'MachineLearning'];

function categorizeRedditPost(title: string, subreddit: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerSubreddit = subreddit.toLowerCase();
  
  if (lowerSubreddit === 'machinelearning' || lowerSubreddit === 'artificial' ||
      lowerTitle.includes('ai') || lowerTitle.includes('machine learning')) {
    return 'AI/ML';
  }
  if (lowerTitle.includes('blockchain') || lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin')) {
    return 'Blockchain';
  }
  if (lowerSubreddit === 'startups' || lowerTitle.includes('startup') || lowerTitle.includes('founder')) {
    return 'Startups';
  }
  if (lowerTitle.includes('security') || lowerTitle.includes('hack') || lowerTitle.includes('vulnerability')) {
    return 'Security';
  }
  if (lowerSubreddit === 'programming' || lowerTitle.includes('code') || lowerTitle.includes('developer')) {
    return 'Programming';
  }
  
  return 'Technology';
}

function extractRedditTags(title: string, subreddit: string): string[] {
  const tags = new Set<string>();
  const words = title.toLowerCase().split(/\W+/);
  
  // Add subreddit as a tag
  tags.add(subreddit.toLowerCase());
  
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

export async function fetchRedditPosts(limit: number = 30): Promise<NewsItem[]> {
  try {
    // Fetch top posts from each subreddit in parallel
    const subredditPosts = await Promise.all(
      SUBREDDITS.map(async (subreddit) => {
        try {
          const response = await axios.get(`${REDDIT_API_BASE}/r/${subreddit}/top.json`, {
            params: {
              limit: Math.ceil(limit / SUBREDDITS.length),
              t: 'day'
            }
          });
          
          return response.data.data.children
            .filter((post: any) => !post.data.is_self) // Filter out self posts
            .map((post: any): NewsItem => {
              const data = post.data;
              const newsItem: NewsItem = {
                id: data.id,
                title: data.title,
                url: data.url,
                publishDate: new Date(data.created_utc * 1000).toISOString(),
                source: 'reddit',
                score: data.score,
                tags: extractRedditTags(data.title, subreddit),
                category: categorizeRedditPost(data.title, subreddit)
              };

              if (data.selftext) {
                newsItem.content = data.selftext;
              }

              return newsItem;
            });
        } catch (error) {
          console.error(`Error fetching posts from r/${subreddit}:`, error);
          return [];
        }
      })
    );
    
    // Flatten and sort by score
    return subredditPosts
      .flat()
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
}

export async function searchReddit(query: string): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${REDDIT_API_BASE}/search.json`, {
      params: {
        q: query,
        restrict_sr: true,
        sort: 'relevance',
        t: 'month',
        limit: 30
      }
    });
    
    return response.data.data.children
      .filter((post: any) => !post.data.is_self)
      .map((post: any): NewsItem => {
        const data = post.data;
        const newsItem: NewsItem = {
          id: data.id,
          title: data.title,
          url: data.url,
          publishDate: new Date(data.created_utc * 1000).toISOString(),
          source: 'reddit',
          score: data.score,
          tags: extractRedditTags(data.title, data.subreddit),
          category: categorizeRedditPost(data.title, data.subreddit)
        };

        if (data.selftext) {
          newsItem.content = data.selftext;
        }

        return newsItem;
      });
  } catch (error) {
    console.error('Error searching Reddit:', error);
    return [];
  }
} 