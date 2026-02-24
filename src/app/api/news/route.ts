import { NextRequest, NextResponse } from 'next/server';
import { getLatestArticles } from '@/services/newsService';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categorySlug = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const articles = await getLatestArticles(limit, categorySlug);

        return NextResponse.json({ articles });
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch articles' },
            { status: 500 }
        );
    }
}
