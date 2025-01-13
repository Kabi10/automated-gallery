import axios from 'axios';
import { Article, TelegramPost, ScrapingResult } from './types';
import { getActiveChannels, ChannelConfig } from './channelConfig';
import { logger } from '../logger';

export class TelegramScraper {
  private readonly BASE_URL = 'https://t.me/s/';

  async getChannelPosts(username: string, limit: number): Promise<TelegramPost[]> {
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
              ? dateMatches[index].match(/"([^"]+)"/)?.[1] || new Date().toISOString()
              : new Date().toISOString();

            const viewsText = viewMatches?.[index]
              ? viewMatches[index].match(/>([^<]+)</)?.[1] || '0'
              : '0';
            const views = parseInt(viewsText.replace('K', '000')) || 0;

            posts.push({
              id: index + 1,
              text,
              date,
              views
            });
          });
        }

        return posts;
      }

      return [];
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching posts: ${error.message}`);
      }
      return [];
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

  async scrapeChannel(channel: ChannelConfig): Promise<ScrapingResult> {
    try {
      logger.info(`📺 Processing channel: @${channel.username}`);
      logger.info(`📋 Category: ${channel.category}`);
      logger.info(`🌐 Language: ${channel.language}`);

      const posts = await this.getChannelPosts(channel.username, channel.postsPerScrape);
      
      if (!posts || posts.length === 0) {
        return {
          channel,
          posts: 0,
          articles: [],
          error: 'No posts found'
        };
      }

      const articles = posts.map(post => ({
        title: post.text.slice(0, 50) + '...',
        content: post.text,
        category: channel.category,
        source: `telegram:@${channel.username}`,
        url: `https://t.me/${channel.username}/${post.id}`,
        publishDate: new Date(post.date),
        tags: [...channel.tags, ...this.extractTags(post.text)],
        views: post.views,
        language: channel.language
      }));

      return {
        channel,
        posts: posts.length,
        articles,
        lastPostDate: new Date(posts[0].date)
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error(`Error scraping channel @${channel.username}: ${errorMessage}`);
      return {
        channel,
        posts: 0,
        articles: [],
        error: errorMessage
      };
    }
  }

  async scrapeAllChannels(): Promise<ScrapingResult[]> {
    const channels = getActiveChannels();
    const results: ScrapingResult[] = [];

    for (const channel of channels) {
      const result = await this.scrapeChannel(channel);
      results.push(result);
      
      // Add a small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.logScrapingSummary(results);
    return results;
  }

  private logScrapingSummary(results: ScrapingResult[]) {
    const totalPosts = results.reduce((sum, r) => sum + r.posts, 0);
    const totalArticles = results.reduce((sum, r) => sum + r.articles.length, 0);

    logger.info('\n📊 Scraping Summary:');
    logger.info(`Total Posts: ${totalPosts}`);
    logger.info(`Total Articles: ${totalArticles}\n`);

    logger.info('📈 Channel Stats:\n');
    results.forEach(result => {
      logger.info(`@${result.channel.username}:`);
      logger.info(`- Posts: ${result.posts}`);
      logger.info(`- Articles: ${result.articles.length}`);
      if (result.lastPostDate) {
        logger.info(`- Latest: ${result.lastPostDate.toISOString().split('T')[0]}`);
      }
      if (result.articles.length > 0) {
        logger.info(`- Preview: ${result.articles[0].content.slice(0, 100)}...`);
      }
      if (result.error) {
        logger.info(`- Error: ${result.error}`);
      }
      logger.info('');
    });
  }
} 