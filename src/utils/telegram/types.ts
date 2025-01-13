export interface Article {
  title: string;
  content: string;
  category: string;
  source: string;
  url: string;
  publishDate: Date;
  tags: string[];
  views: number;
  language: string;
}

export interface TelegramPost {
  id: number;
  text: string;
  date: string;
  views: number;
}

export interface ScrapingResult {
  channel: {
    username: string;
    name: string;
    category: string;
    language: string;
    postsPerScrape: number;
  };
  posts: number;
  articles: Article[];
  lastPostDate?: Date;
  error?: string;
} 