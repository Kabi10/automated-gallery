import React from 'react';

interface GalleryFiltersProps {
  onCategorySelect: (category: string | null) => void;
  onLanguageSelect: (language: string | null) => void;
  selectedCategory: string | null;
  selectedLanguage: string | null;
}

const CATEGORIES = [
  { id: 'tech', name: 'Technology' },
  { id: 'startup', name: 'Startups' },
  { id: 'ai', name: 'AI/ML' },
  { id: 'product', name: 'Products' }
];

const LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'ru', name: 'Russian' }
];

export function GalleryFilters({
  onCategorySelect,
  onLanguageSelect,
  selectedCategory,
  selectedLanguage
}: GalleryFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategorySelect(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Languages</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onLanguageSelect(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedLanguage === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {LANGUAGES.map((language) => (
            <button
              key={language.id}
              onClick={() => onLanguageSelect(language.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedLanguage === language.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {language.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 