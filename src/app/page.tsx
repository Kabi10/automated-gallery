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

const TEST_IMAGES = [
  {
    url: 'https://picsum.photos/seed/pinecones/800/600',
    name: 'Pine Cones'
  },
  {
    url: 'https://picsum.photos/seed/tower/800/600',
    name: 'Misty Tower'
  },
  {
    url: 'https://picsum.photos/seed/coast/800/600',
    name: 'Coastal Cliffs'
  }
];

export default function Home() {
  const [items, setItems] = React.useState<GalleryItem[]>(mockGalleryItems);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [selectedOrientation, setSelectedOrientation] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [testResults, setTestResults] = React.useState<Record<string, ImageAnalysisResult | null>>({});
  const [analyzing, setAnalyzing] = React.useState<Record<string, boolean>>({});
  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  // Function to analyze a single image
  const analyzeSelectedImage = async (image: typeof TEST_IMAGES[0]) => {
    try {
      setErrors(prev => ({ ...prev, [image.url]: null }));
      setAnalyzing(prev => ({ ...prev, [image.url]: true }));
      
      const result = await analyzeImage(image.url);
      setTestResults(prev => ({ ...prev, [image.url]: result }));
      console.log(`Analysis Result for ${image.name}:`, result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze image';
      setErrors(prev => ({ ...prev, [image.url]: message }));
      console.error(`Test Error for ${image.name}:`, err);
    } finally {
      setAnalyzing(prev => ({ ...prev, [image.url]: false }));
    }
  };

  // Function to analyze all images
  const analyzeAllImages = async () => {
    for (const image of TEST_IMAGES) {
      await analyzeSelectedImage(image);
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
            
            <div className="flex flex-col gap-6">
              {/* Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TEST_IMAGES.map((img) => (
                  <div key={img.url} className="flex flex-col gap-4">
                    <div className="relative h-48 overflow-hidden rounded-lg border-2 border-gray-200">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-2">
                        <span className="text-sm text-white font-medium">{img.name}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => analyzeSelectedImage(img)}
                      disabled={analyzing[img.url]}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 font-medium"
                    >
                      {analyzing[img.url] ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Analyzing...
                        </span>
                      ) : (
                        'Analyze Image'
                      )}
                    </button>

                    {errors[img.url] && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <h3 className="font-medium text-red-800 mb-2">Error:</h3>
                        <p className="text-sm text-red-600">{errors[img.url]}</p>
                      </div>
                    )}

                    {testResults[img.url] && !errors[img.url] && (
                      <div className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                        <h3 className="font-medium text-gray-900 mb-2">Analysis Results:</h3>
                        <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-md">
                          {JSON.stringify(testResults[img.url], null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Analyze All Button */}
              <button
                onClick={analyzeAllImages}
                disabled={Object.values(analyzing).some(Boolean)}
                className="w-fit px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 font-medium"
              >
                {Object.values(analyzing).some(Boolean) ? 'Analyzing...' : 'Analyze All Images'}
              </button>
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