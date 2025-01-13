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

// Export a type guard
export function isArticle(obj: any): obj is Article {
  return (
    typeof obj === 'object' &&
    typeof obj.title === 'string' &&
    typeof obj.content === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.source === 'string' &&
    typeof obj.url === 'string' &&
    obj.publishDate instanceof Date &&
    Array.isArray(obj.tags) &&
    typeof obj.views === 'number' &&
    typeof obj.language === 'string'
  );
} 