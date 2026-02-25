import { NextRequest, NextResponse } from 'next/server';
import { getLatestArticles } from '@/services/newsService';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const categorySlug = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '8', 10);
        const page = parseInt(searchParams.get('page') || '1', 10);

        const result = await getLatestArticles(page, limit, categorySlug);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch articles' },
            { status: 500 }
        );
    }
}
