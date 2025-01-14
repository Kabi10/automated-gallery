import axios from 'axios';
import { NewsItem } from '../types';

const REDDIT_API_BASE = 'https://www.reddit.com';
const SUBREDDITS = ['technology', 'programming', 'artificial', 'startups', 'MachineLearning'];

export async function fetchRedditPosts(limit: number = 30): Promise<NewsItem[]> {
  try {
    // Fetch posts from multiple subreddits in parallel
    const allPosts = await Promise.all(
      SUBREDDITS.map(async (subreddit) => {
        const response = await axios.get(`${REDDIT_API_BASE}/r/${subreddit}/top.json`, {
          params: {
            limit: Math.ceil(limit / SUBREDDITS.length),
            t: 'day'
          }
        });

        return response.data.data.children.map((post: any) => ({
          id: `reddit-${post.data.id}`,
          title: post.data.title,
          url: post.data.url,
          content: post.data.selftext,
          summary: post.data.selftext?.slice(0, 200),
          publishDate: new Date(post.data.created_utc * 1000),
          source: 'reddit' as const,
          score: post.data.score,
          category: categorizeRedditPost(post.data, subreddit),
          tags: extractRedditTags(post.data, subreddit)
        }));
      })
    );

    // Flatten and sort by score
    return allPosts
      .flat()
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching from Reddit:', error);
    return [];
  }
}

export async function searchReddit(query: string, limit: number = 30): Promise<NewsItem[]> {
  try {
    const response = await axios.get(`${REDDIT_API_BASE}/search.json`, {
      params: {
        q: query,
        limit,
        sort: 'relevance',
        t: 'month',
        restrict_sr: 'on',
        subreddit: SUBREDDITS.join('+')
      }
    });

    return response.data.data.children.map((post: any) => ({
      id: `reddit-${post.data.id}`,
      title: post.data.title,
      url: post.data.url,
      content: post.data.selftext,
      summary: post.data.selftext?.slice(0, 200),
      publishDate: new Date(post.data.created_utc * 1000),
      source: 'reddit' as const,
      score: post.data.score,
      category: categorizeRedditPost(post.data, post.data.subreddit),
      tags: extractRedditTags(post.data, post.data.subreddit)
    }));
  } catch (error) {
    console.error('Error searching Reddit:', error);
    return [];
  }
}

function categorizeRedditPost(post: any, subreddit: string): string {
  const lowerTitle = post.title.toLowerCase();
  
  if (subreddit === 'artificial' || subreddit === 'MachineLearning' || 
      lowerTitle.includes('ai') || lowerTitle.includes('gpt')) {
    return 'ai';
  }
  if (subreddit === 'startups') {
    return 'startup';
  }
  if (subreddit === 'programming' || lowerTitle.includes('code') || lowerTitle.includes('dev')) {
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

function extractRedditTags(post: any, subreddit: string): string[] {
  const tags = new Set<string>([subreddit.toLowerCase()]);
  const lowerTitle = post.title.toLowerCase();
  
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

  // Add post flair if available
  if (post.link_flair_text) {
    tags.add(post.link_flair_text.toLowerCase());
  }
  
  return Array.from(tags);
} 