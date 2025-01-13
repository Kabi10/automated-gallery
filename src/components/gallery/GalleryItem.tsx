import React from 'react';
import Image from 'next/image';
import { AIAnalysis } from '@/utils/ai';

interface GalleryItemProps {
  item: {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    tags?: string[];
    aiGenerated?: AIAnalysis;
  };
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ item }) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <span className="text-sm text-blue-600 font-semibold">{item.category}</span>
        <h2 className="mt-2 text-xl font-bold text-gray-900 line-clamp-2">
          {item.title}
        </h2>
        <p className="mt-2 text-gray-600 line-clamp-3">{item.excerpt}</p>
        
        {item.aiGenerated && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {item.aiGenerated.suggestedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-1">
              {item.aiGenerated.colorPalette.map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Read More
          </button>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}; 