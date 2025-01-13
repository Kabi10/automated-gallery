import React from 'react';
import { commonColors, getColorName } from '@/utils/colors';

export interface GalleryFiltersProps {
  onColorSelect: (color: string | null) => void;
  onOrientationSelect: (orientation: string | null) => void;
  selectedColor: string | null;
  selectedOrientation: string | null;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  onColorSelect,
  onOrientationSelect,
  selectedColor,
  selectedOrientation,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Color filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Color</h3>
        <div className="flex flex-wrap gap-2">
          {commonColors.map((color: string) => (
            <button
              key={color}
              onClick={() => onColorSelect(selectedColor === color ? null : color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                selectedColor === color ? 'border-blue-500 scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
              title={getColorName(color)}
            />
          ))}
        </div>
      </div>

      {/* Orientation filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Orientation</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onOrientationSelect(selectedOrientation === 'landscape' ? null : 'landscape')}
            className={`px-4 py-2 rounded-md text-sm ${
              selectedOrientation === 'landscape'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Landscape
          </button>
          <button
            onClick={() => onOrientationSelect(selectedOrientation === 'portrait' ? null : 'portrait')}
            className={`px-4 py-2 rounded-md text-sm ${
              selectedOrientation === 'portrait'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Portrait
          </button>
        </div>
      </div>
    </div>
  );
}; 