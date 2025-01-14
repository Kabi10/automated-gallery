'use client';

import React from 'react';
import { Article } from '@/services/scraper/telegram/types';

interface GalleryGridProps {
  items: Article[];
  onItemClick: (item: Article) => void;
}

export function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No articles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <article
          key={`${item.channelUsername}_${index}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onItemClick(item)}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {item.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{item.category}</span>
              <span>{item.views} views</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                <span
                  key={tagIndex}
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
  );
} 