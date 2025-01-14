'use client';

import React, { useEffect, useState } from 'react';
import { TelegramScraper } from '@/utils/telegram/telegramScraper';
import { Article } from '@/services/scraper/telegram/types';
import { saveArticle } from '@/lib/db';
import { GalleryFilters } from '@/components/gallery/GalleryFilters';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

const CHANNELS = [
  { username: 'durov', name: 'Pavel Durov', category: 'tech', language: 'en' },
  { username: 'telegram', name: 'Telegram News', category: 'tech', language: 'en' },
  { username: 'startupoftheday', name: 'Startup of the Day', category: 'startup', language: 'ru' }
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    setIsLoading(true);
    try {
      const scraper = new TelegramScraper();
      const allArticles: Article[] = [];
      
      for (const channel of CHANNELS) {
        const result = await scraper.getChannelPosts(
          channel.username,
          10,
          channel.category,
          channel.language
        );
        if (result.articles.length > 0) {
          allArticles.push(...result.articles);
          // Save articles to database
          await Promise.all(
            result.articles.map((article: Article) => saveArticle(article, channel.username))
          );
        }
      }

      setArticles(allArticles);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === 'all' || article.category === selectedCategory;
    const languageMatch = selectedLanguage === 'all' || article.language === selectedLanguage;
    return categoryMatch && languageMatch;
  });

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tech Pulse Aggregator
          </h1>
          <p className="text-lg text-gray-600">
            Stay updated with the latest in tech, startups, and innovation
          </p>
        </div>

        <GalleryFilters
          onCategorySelect={setSelectedCategory}
          onLanguageSelect={setSelectedLanguage}
          selectedCategory={selectedCategory}
          selectedLanguage={selectedLanguage}
        />

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading content...</p>
          </div>
        ) : (
          <GalleryGrid
            items={filteredArticles}
            onItemClick={(article: Article) => window.open(article.url, '_blank')}
          />
        )}
      </div>
    </main>
  );
} 