import { TelegramScraper } from '../utils/telegram/telegramScraper';
import { logger } from '../utils/logger';

async function main() {
  logger.info('🚀 Starting multi-channel scraper...\n');
  
  const scraper = new TelegramScraper();
  await scraper.scrapeAllChannels();
}

main().catch(error => {
  logger.error('Failed to run scraper:');
  logger.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}); 