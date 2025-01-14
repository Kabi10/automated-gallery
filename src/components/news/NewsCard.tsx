import React from 'react';
import { format } from 'date-fns';
import { NewsItem } from '@/types';

interface NewsCardProps {
  article: NewsItem;
  onClick?: () => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
  const sourceColors = {
    hackernews: {
      bg: 'bg-orange-500',
      icon: '🔥'
    },
    devto: {
      bg: 'bg-indigo-500',
      icon: '💻'
    },
    reddit: {
      bg: 'bg-red-500',
      icon: '🚀'
    }
  };

  const sentimentIcons = {
    positive: '✨',
    negative: '💭',
    neutral: '💫'
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-xl transition-transform duration-300 overflow-hidden cursor-pointer
        border border-gray-100 dark:border-gray-700
        hover:border-blue-500 dark:hover:border-blue-400
        shadow-sm hover:shadow-xl
        hover:-translate-y-1"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {/* Source Badge */}
          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${sourceColors[article.source].bg} text-white`}>
            <span className="mr-2">{sourceColors[article.source].icon}</span>
            {article.source === 'hackernews' ? 'Hacker News' : article.source === 'devto' ? 'Dev.to' : 'Reddit'}
          </span>

          {/* Date */}
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {format(new Date(article.publishDate), 'MMM d, yyyy')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {article.title}
        </h3>

        {/* AI Summary */}
        {article.aiSummary && (
          <div className="relative mb-4">
            <div className="border-l-2 border-blue-500 pl-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {article.aiSummary}
              </p>
            </div>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                +{article.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Score */}
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span className="text-sm font-bold">
              {article.score} points
            </span>
          </div>

          {/* Sentiment */}
          {article.sentiment && (
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <span className="text-lg">
                {sentimentIcons[article.sentiment]}
              </span>
              <span className="text-sm font-medium capitalize">
                {article.sentiment}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 