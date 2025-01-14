import { z } from 'zod';

export const ChannelConfigSchema = z.object({
  username: z.string(),
  name: z.string(),
  category: z.enum(['tech', 'startup', 'ai', 'product']),
  language: z.enum(['en', 'ru']),
  postsPerScrape: z.number().min(1).max(50),
  description: z.string(),
  tags: z.array(z.string()),
  updateFrequency: z.enum(['daily', 'weekly', 'monthly']),
  quality: z.enum(['high', 'medium', 'low']),
});

export type ChannelConfig = z.infer<typeof ChannelConfigSchema>;

export const ACTIVE_CHANNELS: ChannelConfig[] = [
  {
    username: 'durov',
    name: 'Pavel Durov',
    category: 'tech',
    language: 'en',
    postsPerScrape: 10,
    description: 'Official channel of Telegram founder Pavel Durov with insights on tech, product development, and industry trends',
    tags: ['telegram', 'tech', 'startup', 'product'],
    updateFrequency: 'weekly',
    quality: 'high'
  },
  {
    username: 'telegram',
    name: 'Telegram News',
    category: 'product',
    language: 'en',
    postsPerScrape: 10,
    description: 'Official Telegram channel for product updates, feature announcements, and platform news',
    tags: ['telegram', 'updates', 'features', 'tech'],
    updateFrequency: 'weekly',
    quality: 'high'
  },
  {
    username: 'startupoftheday',
    name: 'Startup of the Day',
    category: 'startup',
    language: 'ru',
    postsPerScrape: 10,
    description: 'Daily coverage of innovative startups, funding news, and entrepreneurship insights',
    tags: ['startups', 'funding', 'innovation', 'business'],
    updateFrequency: 'daily',
    quality: 'high'
  },
  {
    username: 'huggingface',
    name: 'Hugging Face',
    category: 'ai',
    language: 'en',
    postsPerScrape: 10,
    description: 'AI technology updates, machine learning developments, and industry news from Hugging Face',
    tags: ['ai', 'ml', 'technology', 'research'],
    updateFrequency: 'weekly',
    quality: 'high'
  }
];

export const getChannelConfig = (username: string): ChannelConfig | undefined => {
  return ACTIVE_CHANNELS.find(channel => channel.username === username);
};

export const getActiveChannels = (): ChannelConfig[] => {
  return ACTIVE_CHANNELS;
};

export const getChannelsByCategory = (category: ChannelConfig['category']): ChannelConfig[] => {
  return ACTIVE_CHANNELS.filter(channel => channel.category === category);
};

export const getChannelsByLanguage = (language: ChannelConfig['language']): ChannelConfig[] => {
  return ACTIVE_CHANNELS.filter(channel => channel.language === language);
}; 