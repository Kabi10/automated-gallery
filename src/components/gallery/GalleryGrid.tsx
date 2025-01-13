'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { GalleryItem } from './GalleryItem';
import { ImageAnalysisResult } from '@/utils/gemini';

interface GalleryItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  aiAnalysis?: ImageAnalysisResult;
}

interface GalleryGridProps {
  items: GalleryItem[];
  onLoadMore: () => void;
  loading: boolean;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onLoadMore, loading }) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  React.useEffect(() => {
    if (inView && !loading) {
      onLoadMore();
    }
  }, [inView, onLoadMore, loading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
      
      {/* Loading indicator */}
      <div ref={ref} className="col-span-full flex justify-center py-8">
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        ) : (
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}; 