import React from 'react';
import { Article } from '@/types/article';

interface GalleryItemProps {
  item: Article;
  onClick?: () => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = ({ item, onClick }) => {
  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">{item.content}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{item.category}</span>
          <span>{item.views} views</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryItem; 