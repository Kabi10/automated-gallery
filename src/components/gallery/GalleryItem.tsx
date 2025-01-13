import React from 'react';
import Image from 'next/image';

interface GalleryItemProps {
  item: {
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
        <p className="text-gray-600 text-sm mb-3">{item.excerpt}</p>
        
        {item.aiGenerated && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {item.aiGenerated.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={`Color ${index + 1}`}
                />
              ))}
            </div>
            
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