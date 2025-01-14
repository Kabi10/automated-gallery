export type NewsSource = 'hackernews' | 'devto' | 'reddit';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  publishDate: string;
  source: NewsSource;
  score: number;
  category?: string;
  tags: string[];
  aiSummary?: string;
  aiTopics?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface DateRange {
  start?: string;
  end?: string;
}

export interface NewsFilter {
  categories?: string[];
  sources?: NewsSource[];
  dateRange?: DateRange;
  tags?: string[];
  searchQuery?: string;
}

export interface NewsAggregatorResponse {
  items: NewsItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
} 