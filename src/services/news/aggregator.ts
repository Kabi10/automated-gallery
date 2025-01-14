import { NewsItem, NewsFilter, NewsAggregatorResponse } from './types';
import { fetchHackerNews, searchHackerNews } from './sources/hackernews';
import { fetchDevToArticles, searchDevTo } from './sources/devto';
import { fetchRedditPosts, searchReddit } from './sources/reddit';
import { generateSummary } from '../ai/summarizer';

export async function fetchAllNews(
  filter?: NewsFilter,
  limit: number = 30
): Promise<NewsAggregatorResponse> {
  try {
    // Fetch from all sources in parallel
    const [hackerNews, devToArticles, redditPosts] = await Promise.all([
      fetchHackerNews(limit),
      fetchDevToArticles(limit),
      fetchRedditPosts(limit)
    ]);

    // Combine all articles
    let allArticles = [...hackerNews, ...devToArticles, ...redditPosts];

    // Apply filters
    if (filter) {
      allArticles = filterArticles(allArticles, filter);
    }

    // Sort by date and score
    allArticles.sort((a, b) => {
      // First sort by date
      const dateCompare = b.publishDate.getTime() - a.publishDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // Then by score
      return (b.score || 0) - (a.score || 0);
    });

    // Generate AI summaries for top articles
    const topArticles = allArticles.slice(0, limit);
    await addAISummaries(topArticles);

    return {
      items: topArticles,
      totalCount: allArticles.length,
      hasMore: allArticles.length > limit
    };
  } catch (error) {
    console.error('Error aggregating news:', error);
    return {
      items: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

export async function searchAllSources(
  query: string,
  filter?: NewsFilter,
  limit: number = 30
): Promise<NewsAggregatorResponse> {
  try {
    // Search all sources in parallel
    const [hackerNews, devToArticles, redditPosts] = await Promise.all([
      searchHackerNews(query, limit),
      searchDevTo(query, limit),
      searchReddit(query, limit)
    ]);

    // Combine all articles
    let allArticles = [...hackerNews, ...devToArticles, ...redditPosts];

    // Apply filters
    if (filter) {
      allArticles = filterArticles(allArticles, filter);
    }

    // Sort by relevance (using score as a proxy)
    allArticles.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Generate AI summaries for top articles
    const topArticles = allArticles.slice(0, limit);
    await addAISummaries(topArticles);

    return {
      items: topArticles,
      totalCount: allArticles.length,
      hasMore: allArticles.length > limit
    };
  } catch (error) {
    console.error('Error searching news:', error);
    return {
      items: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

function filterArticles(articles: NewsItem[], filter: NewsFilter): NewsItem[] {
  return articles.filter(article => {
    // Filter by categories
    if (filter.categories?.length && !filter.categories.includes(article.category)) {
      return false;
    }

    // Filter by sources
    if (filter.sources?.length && !filter.sources.includes(article.source)) {
      return false;
    }

    // Filter by date range
    if (filter.dateFrom && article.publishDate < filter.dateFrom) {
      return false;
    }
    if (filter.dateTo && article.publishDate > filter.dateTo) {
      return false;
    }

    // Filter by tags
    if (filter.tags?.length && !article.tags.some(tag => filter.tags?.includes(tag))) {
      return false;
    }

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query) ||
        article.summary?.toLowerCase().includes(query)
      );
    }

    return true;
  });
}

async function addAISummaries(articles: NewsItem[]): Promise<void> {
  // Process in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (article) => {
        if (!article.aiSummary && (article.content || article.summary)) {
          try {
            const text = article.content || article.summary || '';
            article.aiSummary = await generateSummary(text);
          } catch (error) {
            console.error(`Error generating AI summary for article ${article.id}:`, error);
          }
        }
      })
    );
  }
} 