import React from 'react';
import Image from 'next/image';
import { ImageAnalysisResult } from '@/utils/gemini';

interface GalleryItemProps {
  item: {
    id: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    tags?: string[];
    aiAnalysis?: ImageAnalysisResult;
  };
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ item }) => {
  return (
    <div className="gallery-item bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {item.aiAnalysis?.description || item.excerpt}
        </p>
        
        {item.aiAnalysis && (
          <div className="space-y-3">
            {/* Color Palette */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Colors</p>
              <div className="flex flex-wrap gap-1">
                {item.aiAnalysis.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-medium">Tags</p>
              <div className="flex flex-wrap gap-2">
                {item.aiAnalysis.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Mood and Composition */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-gray-500 font-medium">Mood</p>
                <p className="text-gray-700">{item.aiAnalysis.mood}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Composition</p>
                <p className="text-gray-700">{item.aiAnalysis.composition}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">{item.category}</span>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}; 