import { TelegramPost, Article, ChannelInfo, ScrapingResult } from './types';
import { logger } from '../logger';
import axios from 'axios';

export class TelegramScraper {
  private getChannelInfo(username: string): ChannelInfo {
    return {
      username,
      name: username, // Default to username
      category: 'tech', // Default category
      language: 'en' // Default language
    };
  }

  private processPostsIntoArticles(posts: TelegramPost[], channelUsername: string, category: string, language: string): Article[] {
    return posts.map(post => ({
      id: `${channelUsername}_${post.id}`,
      title: post.text.split('\n')[0].slice(0, 100),
      content: post.text,
      excerpt: post.text.slice(0, 200),
      category,
      source: `https://t.me/${channelUsername}`,
      url: `https://t.me/${channelUsername}/${post.id}`,
      publishDate: new Date(post.date),
      views: post.views,
      language,
      tags: this.extractTags(post.text),
      channelUsername,
      images: post.images
    }));
  }

  private extractTags(text: string): string[] {
    const tags: string[] = [];
    // Extract hashtags
    const hashtagRegex = /#[\w-]+/g;
    const hashtags = text.match(hashtagRegex);
    if (hashtags) {
      tags.push(...hashtags.map(tag => tag.slice(1)));
    }
    // Extract key terms (words longer than 4 chars)
    const words = text.split(/\s+/);
    const keyTerms = words.filter(word => word.length > 4 && !word.startsWith('#'));
    tags.push(...keyTerms.slice(0, 5));
    return [...new Set(tags)]; // Remove duplicates
  }

  public async scrapeChannel(username: string, limit: number = 10): Promise<ScrapingResult> {
    try {
      logger.info(`Fetching posts from @${username}...`);
      const url = `https://t.me/s/${username}`;
      const response = await axios.get(url);
      
      if (response.status !== 200) {
        return {
          channel: this.getChannelInfo(username),
          posts: [],
          articles: [],
          error: `Failed to fetch posts: ${response.status}`
        };
      }

      const html = response.data;
      const posts: TelegramPost[] = [];
      const postRegex = /<div class="tgme_widget_message_wrap[^>]*>.*?<div class="tgme_widget_message_text[^>]*>(.*?)<\/div>.*?<time datetime="([^"]+)"[^>]*>.*?<span class="tgme_widget_message_views">([^<]+)<\/span>/gs;
      
      let match;
      let index = 0;
      while ((match = postRegex.exec(html)) !== null && index < limit) {
        const [_, text, date, views] = match;
        posts.push({
          id: (index + 1).toString(),
          text: text.replace(/<[^>]*>/g, '').trim(),
          date: date,
          views: parseInt(views.replace(/[^0-9]/g, '')) || 0,
          images: [] // TODO: Extract image URLs
        });
        index++;
      }

      const channel = this.getChannelInfo(username);
      const articles = this.processPostsIntoArticles(posts, username, channel.category, channel.language);
      
      return {
        channel,
        posts,
        articles,
        lastPostDate: posts.length > 0 ? new Date(posts[0].date) : undefined
      };

    } catch (error) {
      logger.error(`Error scraping channel @${username}: ${error}`);
      return {
        channel: this.getChannelInfo(username),
        posts: [],
        articles: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async getChannelPosts(
    username: string, 
    limit: number = 10, 
    category: string = 'tech', 
    language: string = 'en'
  ): Promise<ScrapingResult> {
    const result = await this.scrapeChannel(username, limit);
    // Override the channel info with provided category and language
    result.channel.category = category;
    result.channel.language = language;
    // Update articles with the new category and language
    result.articles = result.articles.map(article => ({
      ...article,
      category,
      language
    }));
    return result;
  }
} 