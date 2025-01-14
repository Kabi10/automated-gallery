import { TelegramScraper } from '@/utils/telegram/telegramScraper';
import { ScrapingResult } from '@/services/scraper/telegram/types';

async function testChannel(channelName: string): Promise<boolean> {
  try {
    const scraper = new TelegramScraper();
    const result: ScrapingResult = await scraper.getChannelPosts(channelName, 3);

    if (result.posts.length > 0) {
      console.log(`✅ Channel is public and active! Found ${result.posts.length} posts`);
      console.log('📝 Latest post preview:');
      console.log(`Date: ${new Date(result.posts[0].date).toLocaleDateString()}`);
      console.log(`Views: ${result.posts[0].views}`);
      console.log(`Content: ${result.posts[0].text.substring(0, 100)}...`);
      return true;
    } else {
      console.log(`❌ Channel @${channelName} is not accessible or has no posts`);
      return false;
    }
  } catch (error) {
    console.error(`Error testing channel @${channelName}:`, error);
    return false;
  }
}

async function findPublicChannels() {
  const channels = [
    'startupfeed',
    'businessinsider',
    'techinasia',
    'startupdigest',
    'venturebeat',
    'producthunt',
    'techcrunch',
    'startupstories',
    'ycombinator',
    'saastr',
    'startupgrind',
    'failory',
    'startupL',
    'IndianStartups',
    'startupjobs'
  ];

  const results = {
    working: [] as string[],
    failed: [] as string[]
  };

  for (const channel of channels) {
    console.log(`\nTesting @${channel}...`);
    const isWorking = await testChannel(channel);
    
    if (isWorking) {
      results.working.push(channel);
    } else {
      results.failed.push(channel);
    }
  }

  console.log('\n📊 Results Summary:');
  console.log('✅ Working channels:', results.working.join(', '));
  console.log('❌ Not accessible:', results.failed.join(', '));
}

findPublicChannels().catch(console.error); 