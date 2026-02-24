import { NextRequest, NextResponse } from 'next/server';
import { searchArticlesFuzzy } from '@/services/newsService';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const q = searchParams.get('q');

        if (!q) {
            return NextResponse.json({ articles: [] });
        }

        const articles = await searchArticlesFuzzy(q);

        return NextResponse.json({ articles });
    } catch (error) {
        console.error('Error searching articles:', error);
        return NextResponse.json(
            { error: 'Failed to search articles' },
            { status: 500 }
        );
    }
}
