export type NewsSource = 'hackernews' | 'devto' | 'reddit';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  content?: string;
  summary?: string;
  publishDate: Date;
  source: NewsSource;
  score?: number;
  category: string;
  tags: string[];
  aiSummary?: string;
  aiTopics?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface NewsFilter {
  categories?: string[];
  sources?: NewsSource[];
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  searchQuery?: string;
}

export interface NewsAggregatorResponse {
  items: NewsItem[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
} 