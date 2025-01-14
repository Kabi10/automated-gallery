import axios from 'axios';
import { TelegramPost, Article, ScrapingResult } from './types';
import { logger } from '../logger';

export class TelegramScraper {
  private readonly BASE_URL = 'https://t.me/s/';

  async getChannelPosts(username: string, limit: number = 10, category: string = 'tech', language: string = 'en'): Promise<ScrapingResult> {
    try {
      const url = `${this.BASE_URL}${username.replace('@', '')}`;
      logger.info(`🌐 Trying URL: ${url}`);

      const response = await axios.get(url);
      logger.info(`📊 Response Status: ${response.status}`);

      if (response.status === 200) {
        const html = response.data as string;
        const posts: TelegramPost[] = [];

        // Extract posts using regex
        const postMatches = html.match(/<div class="tgme_widget_message_text js-message_text"[^>]*>(.*?)<\/div>/gs);
        const dateMatches = html.match(/<time datetime="([^"]+)"/g);
        const viewMatches = html.match(/<span class="tgme_widget_message_views">([^<]+)<\/span>/g);

        if (postMatches && postMatches.length > 0) {
          logger.info(`📝 Found ${postMatches.length} posts`);

          postMatches.slice(0, limit).forEach((match, index) => {
            const text = this.cleanText(match);
            const date = dateMatches?.[index]
              ? new Date(dateMatches[index].match(/"([^"]+)"/)?.[1] || new Date().toISOString())
              : new Date();

            const viewsText = viewMatches?.[index]
              ? viewMatches[index].match(/>([^<]+)</)?.[1] || '0'
              : '0';
            const views = parseInt(viewsText.replace('K', '000')) || 0;

            posts.push({
              id: `${username}_${index + 1}`,
              text,
              date,
              views
            });
          });
        }

        const articles = this.processPostsIntoArticles(posts, username, category, language);

        return {
          posts,
          articles,
          channelInfo: {
            username,
            name: username,
            category,
            language
          }
        };
      }

      return {
        posts: [],
        articles: [],
        channelInfo: {
          username,
          name: username,
          category,
          language
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching posts: ${error.message}`);
      }
      return {
        posts: [],
        articles: [],
        channelInfo: {
          username,
          name: username,
          category,
          language
        }
      };
    }
  }

  private cleanText(html: string): string {
    return html
      .replace(/<div class="tgme_widget_message_text js-message_text"[^>]*>/, '')
      .replace(/<\/div>/, '')
      .replace(/<br\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#036;/g, '$')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractTags(text: string): string[] {
    // Extract hashtags
    const hashTags = (text.match(/#\w+/g) || []).map(tag => tag.slice(1));
    
    // Extract key terms (words longer than 4 chars)
    const words = text.split(/\s+/)
      .filter(word => word.length > 4)
      .filter(word => !hashTags.includes(word))
      .slice(0, 5);  // Limit to 5 key terms

    return [...new Set([...hashTags, ...words])];
  }

  private processPostsIntoArticles(posts: TelegramPost[], channelUsername: string, category: string, language: string): Article[] {
    return posts.map(post => {
      const title = post.text.split('\n')[0].slice(0, 100);
      const content = post.text;
      const excerpt = content.slice(0, 200) + (content.length > 200 ? '...' : '');

      return {
        id: `${channelUsername}_${post.id}`,
        title,
        content,
        excerpt,
        category,
        source: `telegram:@${channelUsername}`,
        url: `https://t.me/${channelUsername}/${post.id}`,
        publishDate: post.date,
        views: post.views,
        language,
        tags: this.extractTags(post.text),
        channelUsername,
        images: []
      };
    });
  }
} 