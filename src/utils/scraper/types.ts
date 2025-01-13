export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  images: string[];
  metadata: {
    publishDate: Date;
    author?: string;
    category: string;
    tags: string[];
  }
}

export interface TrendingTopic {
  keyword: string;
  volume: number;
  growth: number;
  relatedTerms: string[];
} 