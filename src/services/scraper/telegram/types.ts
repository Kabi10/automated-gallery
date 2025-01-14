export interface TelegramPost {
  id: string;
  text: string;
  date: string;
  views: number;
  images?: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  source: string;
  url: string;
  publishDate: Date;
  views: number;
  language: string;
  tags: string[];
  channelUsername: string;
  images?: string[];
}

export interface ChannelInfo {
  username: string;
  name: string;
  category: string;
  language: string;
}

export interface ScrapingResult {
  channel: ChannelInfo;
  posts: TelegramPost[];
  articles: Article[];
  lastPostDate?: Date;
  error?: string;
} 