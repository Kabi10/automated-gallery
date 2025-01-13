'use client';

import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { generateAIDescription } from '@/utils/ai';
import { GalleryItem } from './GalleryItem';

interface GalleryItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  aiGenerated?: {
    description: string;
    suggestedTags: string[];
    colorPalette: string[];
  };
}

interface GalleryGridProps {
  items: GalleryItem[];
  onLoadMore: () => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onLoadMore }) => {
  const [processedItems, setProcessedItems] = useState<GalleryItem[]>([]);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Automatically process new items with AI
  useEffect(() => {
    const processNewItems = async () => {
      const newItems = await Promise.all(
        items.map(async (item) => {
          if (!item.aiGenerated) {
            const aiData = await generateAIDescription(item.imageUrl);
            return {
              ...item,
              aiGenerated: aiData,
              excerpt: aiData.description, // Auto-generated description
              tags: aiData.suggestedTags
            };
          }
          return item;
        })
      );
      setProcessedItems(newItems);
    };

    processNewItems();
  }, [items]);

  useEffect(() => {
    if (inView) {
      onLoadMore();
    }
  }, [inView, onLoadMore]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {processedItems.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
      <div ref={ref} className="h-10 w-full col-span-full" />
    </div>
  );
}; 