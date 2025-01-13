import { TelegramScraper } from '../utils/telegram/telegramScraper';
import { ProcessedArticle } from '../utils/telegram/types';

async function saveArticle(article: ProcessedArticle) {
  // Implement your storage logic here
  console.log('Saving article:', article.title);
}

async function pullAndProcessContent() {
  const scraper = new TelegramScraper();

  try {
    // Get posts from Unicorns channel
    const posts = await scraper.getChannelPosts('unicorns');
    console.log(`Fetched ${posts.length} posts`);

    // Process into articles
    const articles = await scraper.processIntoArticles(posts);

    // Save articles
    for (const article of articles) {
      await saveArticle(article);
    }

    console.log('Successfully processed all articles');
  } catch (error) {
    console.error('Error processing content:', error);
  }
}

// Run it
pullAndProcessContent(); 