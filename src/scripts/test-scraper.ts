import { TelegramScraper } from '../utils/telegram/telegramScraper';

async function testChannel(channelName: string) {
  const scraper = new TelegramScraper();
  
  try {
    console.log(`\n🔍 Testing @${channelName}...`);
    const posts = await scraper.getChannelPosts(channelName, 3);
    
    if (posts.length > 0) {
      console.log(`✅ Channel is public and active! Found ${posts.length} posts`);
      console.log('📝 Latest post preview:');
      console.log(`Date: ${posts[0].date.toLocaleDateString()}`);
      console.log(`Views: ${posts[0].views}`);
      console.log(`Text: ${posts[0].text.substring(0, 100).replace(/\n/g, ' ')}...`);
      return true;
    } else {
      console.log('❌ Channel is not accessible');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing channel:', error);
    return false;
  }
}

async function findPublicChannels() {
  console.log('🚀 Searching for public Telegram channels...\n');
  
  const channels = [
    // Tech & News
    'durov',           // Pavel Durov's channel
    'telegram',        // Official Telegram News
    'technologyreview', // MIT Technology Review
    'theverge',        // The Verge
    
    // Startup & Business
    'startupstash',    // Startup resources
    'startupoftheday', // Daily startup features
    'foundersclub',    // Founders discussions
    'startupfunding',  // Funding news
    'startupweekend',  // Startup Weekend events
    'startupschool',   // Y Combinator's Startup School
    
    // AI & Tech
    'openai',          // OpenAI updates
    'huggingface',     // Hugging Face AI
    'aitrending',      // AI News & Updates
    'machinelearning', // ML News
    'artificialintelligence' // AI discussions
  ];

  const results = {
    working: [] as string[],
    failed: [] as string[]
  };

  for (const channel of channels) {
    const isWorking = await testChannel(channel);
    if (isWorking) {
      results.working.push(channel);
    } else {
      results.failed.push(channel);
    }
  }

  console.log('\n📊 Results Summary:');
  console.log('✅ Working channels:');
  results.working.forEach(channel => console.log(`- @${channel}`));
  
  console.log('\n❌ Not accessible:');
  results.failed.forEach(channel => console.log(`- @${channel}`));
}

// Run the channel finder
findPublicChannels(); 