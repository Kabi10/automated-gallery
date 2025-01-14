import { NextResponse } from 'next/server';
import { getArticles, saveArticle } from '@/lib/db';
import { loadEnv, validateEnv } from '@/lib/env';

// Load environment variables
loadEnv();
validateEnv();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const language = searchParams.get('language') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const articles = await getArticles({ category, language, limit, offset });
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { article, channelUsername } = await request.json();
    const result = await saveArticle(article, channelUsername);
    return NextResponse.json({ article: result.rows[0] });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json(
      { error: 'Failed to save article' },
      { status: 500 }
    );
  }
} 