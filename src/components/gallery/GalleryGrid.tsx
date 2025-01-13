'use client';

import React from 'react';
import { format } from 'date-fns';

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  source: string;
  url: string;
  publishDate: Date;
  views: number;
  language: string;
}

interface GalleryGridProps {
  items: ContentItem[];
  onLoadMore: () => void;
  loading: boolean;
}

export function GalleryGrid({ items, onLoadMore, loading }: GalleryGridProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <article key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-blue-600">{item.category}</span>
                <span className="text-sm text-gray-500">{format(item.publishDate, 'MMM d, yyyy')}</span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {item.title}
                </a>
              </h2>
              
              <p className="text-gray-600 mb-4">{item.excerpt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{item.source}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{item.views} views</span>
                </div>
                <span className="text-sm font-medium uppercase">{item.language}</span>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onLoadMore}
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 font-medium"
        >
          {loading ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading...</span>
            </span>
          ) : (
            'Load More'
          )}
        </button>
      </div>
    </div>
  );
} 