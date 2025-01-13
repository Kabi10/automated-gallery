export interface ArticleAnalysis {
  readingTime: number;
  contentType: 'news' | 'blog' | 'opinion' | 'review';
  thumbnailInfo: {
    hasImage: boolean;
    orientation: 'landscape' | 'portrait';
    isHeroImage: boolean;
  };
  metadata: {
    wordCount: number;
    headingsCount: number;
    hasCallToAction: boolean;
    readabilityScore: number;
  };
} 