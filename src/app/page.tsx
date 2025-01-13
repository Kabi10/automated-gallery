'use client';

import React from 'react';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { analyzeImage, ImageAnalysisResult } from '@/utils/gemini';

interface GalleryItem {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  aiAnalysis?: ImageAnalysisResult;
}

// Mock data for gallery items
const mockGalleryItems: GalleryItem[] = [
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
];

export default function Home() {
  const [items, setItems] = React.useState<GalleryItem[]>(mockGalleryItems);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedOrientation, setSelectedOrientation] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [testResult, setTestResult] = React.useState<ImageAnalysisResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Function to test API with a single image
  const testAnalyzeImage = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await analyzeImage('https://picsum.photos/800/600?random=1');
      setTestResult(result);
      console.log('Analysis Result:', result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze image';
      setError(message);
      console.error('Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Test Section */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Gallery</h1>
            <p className="text-gray-600">Test the Gemini API integration below:</p>
            
            <div className="flex flex-col gap-4">
              <button
                onClick={testAnalyzeImage}
                disabled={loading}
                className="w-fit px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Test Gemini API'
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="font-medium text-red-800 mb-2">Error:</h3>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              {testResult && !error && (
                <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                  <h3 className="font-medium text-gray-900 mb-2">Analysis Results:</h3>
                  <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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