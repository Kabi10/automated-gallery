import Image from 'next/image';
import { ContentItem } from '@/lib/db/types';

interface ArticleGridProps {
  items: ContentItem[];
  onLoadMore: () => void;
  loading: boolean;
}

export function ArticleGrid({ items, onLoadMore, loading }: ArticleGridProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {item.title}
                </a>
              </h3>
              <p className="text-gray-600 mb-4">{item.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                <span>{item.views} views</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {items.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
} 