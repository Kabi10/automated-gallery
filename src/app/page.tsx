'use client';

import React from 'react';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { TelegramScraper } from '@/utils/telegram/telegramScraper';
import { getLatestArticles, saveArticle, saveChannel } from '@/lib/db';
import { getActiveChannels } from '@/utils/telegram/channelConfig';
import { ContentItem } from '@/lib/db/types';

// Initialize scraper
const scraper = new TelegramScraper();
const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [items, setItems] = React.useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);

  // Load initial content
  React.useEffect(() => {
    loadContent();
  }, [selectedCategory, selectedLanguage]);

  // Function to load content
  const loadContent = async () => {
    setLoading(true);
    try {
      // First, try to load from database
      const dbArticles = await getLatestArticles(
        ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE,
        selectedCategory || undefined,
        selectedLanguage || undefined
      );

      if (dbArticles.length > 0) {
        setItems(prevItems => [...prevItems, ...dbArticles]);
        setPage(prev => prev + 1);
      } else if (page === 0) {
        // If no articles in DB and it's the first page, scrape new content
        await scrapeAndSaveContent();
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      console.error('Error loading content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to scrape and save content
  const scrapeAndSaveContent = async () => {
    try {
      // Save channel configurations
      const channels = getActiveChannels();
      await Promise.all(channels.map(channel => saveChannel(channel)));

      // Scrape and save articles
      const results = await scraper.scrapeAllChannels();
      await Promise.all(
        results.flatMap(result =>
          result.articles.map(article =>
            saveArticle(article, result.channel.username)
          )
        )
      );

      // Load the saved articles
      const dbArticles = await getLatestArticles(
        ITEMS_PER_PAGE,
        0,
        selectedCategory || undefined,
        selectedLanguage || undefined
      );
      
      setItems(dbArticles);
      setPage(1);
    } catch (error) {
      console.error('Error scraping content:', error);
      throw error;
    }
  };

  // Filter items based on selected category and language
  const filteredItems = items.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    if (selectedLanguage && item.language !== selectedLanguage) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Tech Pulse</h1>
            <p className="text-gray-600">Latest updates from the tech world</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryFilters
          onCategorySelect={setSelectedCategory}
          onLanguageSelect={setSelectedLanguage}
          selectedCategory={selectedCategory}
          selectedLanguage={selectedLanguage}
        />
        
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-medium text-red-800 mb-2">Error:</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <GalleryGrid
          items={filteredItems}
          onLoadMore={loadContent}
          loading={loading}
        />
      </main>
    </div>
  );
} 