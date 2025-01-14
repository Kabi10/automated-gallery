import React from 'react';
import { NewsSource } from '@/types';

const CATEGORIES = [
  'AI/ML',
  'Blockchain',
  'Startups',
  'Security',
  'Programming',
  'Technology'
];

interface NewsFiltersProps {
  selectedSources: NewsSource[];
  selectedCategories: string[];
  searchQuery: string;
  onSourcesChange: (sources: NewsSource[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  onSearchChange: (query: string) => void;
}

export function NewsFilters({
  selectedSources,
  selectedCategories,
  searchQuery,
  onSourcesChange,
  onCategoriesChange,
  onSearchChange,
}: NewsFiltersProps) {
  const sources: { value: NewsSource; label: string }[] = [
    { value: 'hackernews', label: 'Hacker News' },
    { value: 'devto', label: 'Dev.to' },
    { value: 'reddit', label: 'Reddit' },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles..."
          className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200 bg-gray-50 hover:bg-white focus:bg-white"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sources */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Sources
          </h3>
          <div className="space-y-3">
            {sources.map(({ value, label }) => (
              <label key={value} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSources.includes(value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSourcesChange([...selectedSources, value]);
                    } else {
                      onSourcesChange(selectedSources.filter((s) => s !== value));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    onCategoriesChange(
                      selectedCategories.filter((c) => c !== category)
                    );
                  } else {
                    onCategoriesChange([...selectedCategories, category]);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500 ring-opacity-50'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 