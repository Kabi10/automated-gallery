'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { NewsItem, NewsSource } from '@/types';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsFilters } from '@/components/news/NewsFilters';

// Cache constants
const CACHE_KEY = 'techpulse_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheData {
  articles: NewsItem[];
  timestamp: number;
  filters: {
    sources: NewsSource[];
    categories: string[];
    query: string;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSources, setSelectedSources] = useState<NewsSource[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Cache management functions
  const getCachedData = useCallback((): CacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data: CacheData = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }, []);

  const setCachedData = useCallback((articles: NewsItem[]) => {
    try {
      const cacheData: CacheData = {
        articles,
        timestamp: Date.now(),
        filters: {
          sources: selectedSources,
          categories: selectedCategories,
          query: searchQuery
        }
      };
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }, [selectedSources, selectedCategories, searchQuery]);

  // Load cached data on initial mount
  useEffect(() => {
    const cached = getCachedData();
    if (cached) {
      setArticles(cached.articles);
      setSelectedSources(cached.filters.sources);
      setSelectedCategories(cached.filters.categories);
      setSearchQuery(cached.filters.query);
      setLastUpdated(new Date(cached.timestamp));
    } else {
      fetchArticles();
    }
  }, []);

  // Only fetch when filters change and cache is invalid
  useEffect(() => {
    const cached = getCachedData();
    if (!cached || 
        JSON.stringify(cached.filters.sources) !== JSON.stringify(selectedSources) ||
        JSON.stringify(cached.filters.categories) !== JSON.stringify(selectedCategories) ||
        cached.filters.query !== searchQuery) {
      fetchArticles();
    }
  }, [selectedSources, selectedCategories, searchQuery]);

  async function fetchArticles(isBackgroundRefresh = false) {
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (selectedSources.length > 0) {
        params.append('sources', selectedSources.join(','));
      }
      if (selectedCategories.length > 0) {
        params.append('categories', selectedCategories.join(','));
      }
      if (searchQuery) {
        params.append('query', searchQuery);
      }

      const response = await fetch(`/api/news?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const data = await response.json();
      setArticles(data.items);
      setCachedData(data.items);
      
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again later.');
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
    }
  }

  // Format the last updated time
  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    
    const minutes = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (minutes < 1) return 'Updated just now';
    if (minutes === 1) return 'Updated 1 minute ago';
    if (minutes < 60) return `Updated ${minutes} minutes ago`;
    
    return `Updated ${lastUpdated.toLocaleTimeString()}`;
  };

  function handleArticleClick(article: NewsItem) {
    window.open(article.url, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.15] to-transparent dark:from-blue-600/[0.05]"></div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:32px_32px] dark:bg-grid-black/[0.05]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center relative">
            {/* Animated Rings */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-[400px] h-[400px] border border-blue-500/20 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-0 w-[300px] h-[300px] border border-purple-500/20 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow animation-delay-1000"></div>
              <div className="absolute inset-0 w-[200px] h-[200px] border border-pink-500/20 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow animation-delay-2000"></div>
            </div>

            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6 animate-gradient-x relative z-10">
              Tech Pulse
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in-up">
              Your AI-powered tech news aggregator, curating the best from the developer ecosystem
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12 z-10">
        {/* Filters Card */}
        <div className="relative mb-12 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl backdrop-blur-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                {lastUpdated && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getLastUpdatedText()}
                  </p>
                )}
              </div>
              <button
                onClick={() => fetchArticles()}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 transition-colors duration-200"
              >
                <svg
                  className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
            <NewsFilters
              selectedSources={selectedSources}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
              onSourcesChange={setSelectedSources}
              onCategoriesChange={setSelectedCategories}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              {/* Spinner Rings */}
              <div className="absolute inset-0 h-32 w-32 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
              <div className="absolute inset-0 h-32 w-32 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animation-delay-150"></div>
              <div className="absolute inset-0 h-32 w-32 rounded-full border-t-2 border-b-2 border-pink-500 animate-spin animation-delay-300"></div>
              <div className="h-16 w-16 rounded-full bg-white dark:bg-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <NewsGrid
              items={articles}
              onItemClick={handleArticleClick}
            />
          </div>
        )}
      </div>
    </main>
  );
} 