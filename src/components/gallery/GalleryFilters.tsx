import React from 'react';

interface GalleryFiltersProps {
  onCategorySelect: (category: string) => void;
  onLanguageSelect: (language: string) => void;
  selectedCategory: string;
  selectedLanguage: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'tech', label: 'Technology' },
  { id: 'startup', label: 'Startups' },
  { id: 'ai', label: 'AI' },
  { id: 'crypto', label: 'Crypto' }
];

const LANGUAGES = [
  { id: 'all', label: 'All' },
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Russian' }
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
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(language => (
            <button
              key={language.id}
              onClick={() => onLanguageSelect(language.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedLanguage === language.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 