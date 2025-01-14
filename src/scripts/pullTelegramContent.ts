import { TelegramScraper } from '@/utils/telegram/telegramScraper';
import { Article } from '@/services/scraper/telegram/types';
import { saveArticle } from '@/lib/db';

async function pullContent() {
  const scraper = new TelegramScraper();
  
  try {
    const channels = [
      { username: 'durov', name: 'Pavel Durov', category: 'tech', language: 'en' },
      { username: 'telegram', name: 'Telegram News', category: 'tech', language: 'en' },
      { username: 'startupoftheday', name: 'Startup of the Day', category: 'startup', language: 'ru' }
    ];

    for (const channel of channels) {
      console.log(`Pulling content from @${channel.username}...`);
      const result = await scraper.getChannelPosts(channel.username, 10);
      
      if (result.articles.length > 0) {
        for (const article of result.articles) {
          await saveArticle(article, channel.username);
        }
        console.log(`Saved ${result.articles.length} articles from @${channel.username}`);
      } else {
        console.log(`No new articles found from @${channel.username}`);
      }
    }
  } catch (error) {
    console.error('Error pulling content:', error);
  }
}

// Run the script
pullContent().catch(console.error); 