import { NextResponse } from 'next/server';
import { getRandomArticle } from '@/services/newsService';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const article = await getRandomArticle();
        if (article) {
            return NextResponse.redirect(new URL(`/news/${article.slug}`, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
        }
    } catch (error) {
        console.error('Failed to get random article', error);
    }

    // Fallback to /headlines if fail or empty
    return NextResponse.redirect(new URL('/headlines', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
