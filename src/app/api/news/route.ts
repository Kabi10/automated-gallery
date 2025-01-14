import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNews, searchAllSources } from '../../../services/newsAggregator';
import { NewsFilter } from '../../../types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    
    const filter: NewsFilter = {
      categories: searchParams.get('categories')?.split(',') || [],
      sources: searchParams.get('sources')?.split(',') || [],
      dateRange: {
        start: searchParams.get('startDate') || undefined,
        end: searchParams.get('endDate') || undefined
      },
      tags: searchParams.get('tags')?.split(',') || [],
    };

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');

    if (query) {
      const results = await searchAllSources(query, filter, page, limit);
      return NextResponse.json(results);
    } else {
      const news = await fetchAllNews(filter, page, limit);
      return NextResponse.json(news);
    }
  } catch (error) {
    console.error('Error in news API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 