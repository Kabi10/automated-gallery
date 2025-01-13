'use client';

import React, { useState, useCallback } from 'react';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';

// Mock data for initial testing
const MOCK_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `item-${i}`,
  title: `Gallery Item ${i + 1}`,
  excerpt: `This is a beautiful image showcasing nature's wonders.`,
  imageUrl: `https://picsum.photos/seed/${i}/800/600`,
  category: i % 2 === 0 ? 'Nature' : 'Architecture',
}));

export default function Home() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    // Simulate loading more items
    setTimeout(() => {
      const newItems = Array.from({ length: 6 }, (_, i) => ({
        id: `item-${items.length + i}`,
        title: `Gallery Item ${items.length + i + 1}`,
        excerpt: `This is a beautiful image showcasing nature's wonders.`,
        imageUrl: `https://picsum.photos/seed/${items.length + i}/800/600`,
        category: i % 2 === 0 ? 'Nature' : 'Architecture',
      }));
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
    }, 1000);
  }, [items.length]);

  const handleFilterByColor = (color: string) => {
    // Implement color filtering logic
    console.log('Filtering by color:', color);
  };

  const handleFilterByOrientation = (orientation: 'landscape' | 'portrait') => {
    // Implement orientation filtering logic
    console.log('Filtering by orientation:', orientation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Automated Gallery</h1>
          <p className="mt-2 text-gray-600">Discover fascinating stories and images</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <GalleryFilters 
          onFilterByColor={handleFilterByColor}
          onFilterByOrientation={handleFilterByOrientation}
        />
        <GalleryGrid items={items} onLoadMore={handleLoadMore} />
      </main>
    </div>
  );
} 