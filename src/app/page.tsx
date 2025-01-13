'use client';

import React from 'react';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { analyzeImage } from '@/utils/gemini';

// Mock data for gallery items
const mockGalleryItems = [
  {
    id: '1',
    title: 'Mountain Landscape',
    excerpt: 'A beautiful mountain landscape at sunset',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    category: 'Nature',
    tags: ['mountains', 'sunset', 'landscape'],
  },
  {
    id: '2',
    title: 'Urban Architecture',
    excerpt: 'Modern city buildings reaching for the sky',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    category: 'Architecture',
    tags: ['city', 'buildings', 'modern'],
  },
  // Add more mock items as needed
];

export default function Home() {
  const [items, setItems] = React.useState(mockGalleryItems);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedOrientation, setSelectedOrientation] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Function to load more items
  const loadMore = async () => {
    setLoading(true);
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new items with AI analysis
      const newItems = await Promise.all(mockGalleryItems.map(async (item) => {
        const aiAnalysis = await analyzeImage(item.imageUrl);
        return { ...item, aiAnalysis };
      }));
      
      setItems(prevItems => [...prevItems, ...newItems]);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on selected color and orientation
  const filteredItems = items.filter(item => {
    if (selectedColor && (!item.aiAnalysis?.colors.includes(selectedColor))) {
      return false;
    }
    if (selectedOrientation) {
      // Add orientation filtering logic here
      return true;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Gallery</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <GalleryFilters
          onColorSelect={setSelectedColor}
          onOrientationSelect={setSelectedOrientation}
          selectedColor={selectedColor}
          selectedOrientation={selectedOrientation}
        />
        
        <GalleryGrid
          items={filteredItems}
          onLoadMore={loadMore}
          loading={loading}
        />
      </main>
    </div>
  );
} 