import { NewsItem, NewsFilter, NewsAggregatorResponse } from '../types';
import { fetchHackerNews, searchHackerNews } from './sources/hackernews';
import { fetchDevToArticles, searchDevTo } from './sources/devto';
import { fetchRedditPosts, searchReddit } from './sources/reddit';
import { generateSummary, analyzeSentiment, extractTopics } from './ai/summarizer';

const BATCH_SIZE = 5; // Number of articles to process with AI at once

async function addAISummaries(articles: NewsItem[]): Promise<NewsItem[]> {
  const enrichedArticles: NewsItem[] = [];
  
  // Process articles in batches to avoid rate limits
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const enrichedBatch = await Promise.all(
      batch.map(async (article) => {
        if (!article.content && !article.summary) return article;
        
        const textToAnalyze = article.content || article.summary || '';
        const [summary, sentiment, topics] = await Promise.all([
          generateSummary(textToAnalyze),
          analyzeSentiment(textToAnalyze),
          extractTopics(textToAnalyze)
        ]);

        return {
          ...article,
          aiSummary: summary,
          sentiment,
          aiTopics: topics
        };
      })
    );
    enrichedArticles.push(...enrichedBatch);
  }
  
  return enrichedArticles;
}

function filterArticles(articles: NewsItem[], filter: NewsFilter): NewsItem[] {
  return articles.filter(article => {
    if (filter.categories?.length && !filter.categories.includes(article.category || '')) {
      return false;
    }
    
    if (filter.sources?.length && !filter.sources.includes(article.source)) {
      return false;
    }
    
    if (filter.tags?.length && !article.tags.some(tag => filter.tags?.includes(tag))) {
      return false;
    }
    
    if (filter.dateRange?.start && new Date(article.publishDate) < new Date(filter.dateRange.start)) {
      return false;
    }
    
    if (filter.dateRange?.end && new Date(article.publishDate) > new Date(filter.dateRange.end)) {
      return false;
    }
    
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const searchableText = `${article.title} ${article.content || ''} ${article.summary || ''} ${article.tags.join(' ')}`.toLowerCase();
      return searchableText.includes(query);
    }
    
    return true;
  });
}

export async function fetchAllNews(
  filter: NewsFilter,
  page: number = 1,
  limit: number = 30
): Promise<NewsAggregatorResponse> {
  try {
    // Fetch from all sources in parallel
    const [hnArticles, devtoArticles, redditPosts] = await Promise.all([
      fetchHackerNews(),
      fetchDevToArticles(),
      fetchRedditPosts()
    ]);

    // Combine all articles
    let allArticles = [...hnArticles, ...devtoArticles, ...redditPosts];
    
    // Apply filters
    allArticles = filterArticles(allArticles, filter);
    
    // Sort by date and score
    allArticles.sort((a, b) => {
      const dateComparison = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      if (dateComparison !== 0) return dateComparison;
      return b.score - a.score;
    });

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = allArticles.slice(startIndex, endIndex);
    
    // Add AI summaries for the paginated articles
    const enrichedArticles = await addAISummaries(paginatedArticles);

    return {
      items: enrichedArticles,
      total: allArticles.length,
      page,
      limit,
      hasMore: endIndex < allArticles.length
    };
  } catch (error) {
    console.error('Error fetching all news:', error);
    return {
      items: [],
      total: 0,
      page,
      limit,
      hasMore: false
    };
  }
}

export async function searchAllSources(
  query: string,
  filter: NewsFilter,
  page: number = 1,
  limit: number = 30
): Promise<NewsAggregatorResponse> {
  try {
    // Search all sources in parallel
    const [hnResults, devtoResults, redditResults] = await Promise.all([
      searchHackerNews(query),
      searchDevTo(query),
      searchReddit(query)
    ]);

    // Combine all results
    let allResults = [...hnResults, ...devtoResults, ...redditResults];
    
    // Apply additional filters
    allResults = filterArticles(allResults, filter);
    
    // Sort by relevance (using score as a proxy) and date
    allResults.sort((a, b) => {
      const scoreComparison = b.score - a.score;
      if (scoreComparison !== 0) return scoreComparison;
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    });

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    
    // Add AI summaries for the paginated results
    const enrichedResults = await addAISummaries(paginatedResults);

    return {
      items: enrichedResults,
      total: allResults.length,
      page,
      limit,
      hasMore: endIndex < allResults.length
    };
  } catch (error) {
    console.error('Error searching all sources:', error);
    return {
      items: [],
      total: 0,
      page,
      limit,
      hasMore: false
    };
  }
} 