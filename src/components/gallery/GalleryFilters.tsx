import React from 'react';
import { commonColors } from '@/utils/ai';

interface GalleryFiltersProps {
  onFilterByColor: (color: string) => void;
  onFilterByOrientation: (orientation: 'landscape' | 'portrait') => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  onFilterByColor,
  onFilterByOrientation
}) => {
  return (
    <div className="filters-container p-4 bg-white shadow-sm mb-6">
      <div className="color-filters flex gap-2">
        {commonColors.map(color => (
          <button 
            key={color}
            className="w-8 h-8 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => onFilterByColor(color)}
          />
        ))}
      </div>
      
      <div className="orientation-filters mt-4 flex gap-4">
        <button 
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
          onClick={() => onFilterByOrientation('landscape')}
        >
          Landscape
        </button>
        <button 
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600"
          onClick={() => onFilterByOrientation('portrait')}
        >
          Portrait
        </button>
      </div>
    </div>
  );
}; 