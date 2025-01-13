import Image from 'next/image';
import { ArticleAnalysis } from '@/types/article';

interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  publishDate: string;
  author: string;
  category: string;
  analysis?: ArticleAnalysis;
}

export const ArticleGrid: React.FC<{ articles: ArticleItem[] }> = ({ articles }) => {
  return (
    <div className="article-grid">
      {articles.map((article) => (
        <article key={article.id} className="article-card">
          {article.imageUrl && (
            <div className={`article-image ${article.analysis?.thumbnailInfo.isHeroImage ? 'hero' : ''}`}>
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="article-content">
            <div className="article-meta">
              <span className="category">{article.category}</span>
              <span className="reading-time">
                {article.analysis?.readingTime} min read
              </span>
            </div>
            <h2 className="article-title">{article.title}</h2>
            <p className="article-excerpt">{article.excerpt}</p>
            <div className="article-footer">
              <span className="author">{article.author}</span>
              <time>{article.publishDate}</time>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}; 