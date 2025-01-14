import { TelegramScraper } from '../services/scraper/telegram/telegramScraper';
import { Article } from '../services/scraper/telegram/types';
import { saveArticle } from '../lib/db';
import { logger } from '../services/scraper/logger';
import { loadEnv, validateEnv } from '../lib/env';

// Load environment variables
loadEnv();
validateEnv();

const CHANNELS = [
  { username: 'durov', name: 'Pavel Durov', category: 'tech', language: 'en' },
  { username: 'telegram', name: 'Telegram News', category: 'tech', language: 'en' },
  { username: 'startupoftheday', name: 'Startup of the Day', category: 'startup', language: 'ru' },
  { username: 'huggingface', name: 'Hugging Face', category: 'ai', language: 'en' }
];

async function main() {
  logger.info('🚀 Starting multi-channel scraper...\n');
  
  const scraper = new TelegramScraper();
  
  try {
    for (const channel of CHANNELS) {
      logger.info(`📥 Pulling content from @${channel.username}...`);
      const result = await scraper.getChannelPosts(
        channel.username,
        10,
        channel.category,
        channel.language
      );
      
      if (result.articles.length > 0) {
        for (const article of result.articles) {
          await saveArticle(article, channel.username);
        }
        logger.info(`✅ Saved ${result.articles.length} articles from @${channel.username}\n`);
      } else {
        logger.info(`ℹ️ No new articles found from @${channel.username}\n`);
      }
    }
    
    logger.info('✨ Multi-channel scraping completed successfully!\n');
  } catch (error) {
    logger.error('Failed to run scraper:');
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch(error => {
  logger.error('Failed to run scraper:');
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 