import { NextResponse } from 'next/server';
import { db } from '@/db';
import { articles, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
export async function POST() {
    try {
        const apiKey = process.env.NEWS_API_KEY;

        if (!apiKey || apiKey === 'your_api_key_here') {
            return NextResponse.json(
                { error: 'NEWS_API_KEY is not configured in environment variables.' },
                { status: 500 }
            );
        }

        // Predefined NewsAPI categories + custom 'politics'
        const categorySlugs = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology', 'politics'];
        let totalInsertedCount = 0;
        let totalProcessedCount = 0;

        for (const catSlug of categorySlugs) {
            let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${catSlug}&apiKey=${apiKey}`;
            if (catSlug === 'politics') {
                apiUrl = `https://newsapi.org/v2/everything?q=politics&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
            }
            const response = await fetch(apiUrl);

            if (!response.ok) {
                console.error(`NewsAPI Error for category ${catSlug}:`, await response.text());
                continue;
            }

            const data = await response.json();

            if (!data.articles || !Array.isArray(data.articles)) {
                continue;
            }

            // Ensure category exists in DB
            let dbCat = await db.query.categories.findFirst({
                where: eq(categories.slug, catSlug)
            });

            if (!dbCat) {
                const [inserted] = await db.insert(categories).values({
                    name: catSlug.charAt(0).toUpperCase() + catSlug.slice(1),
                    slug: catSlug,
                }).returning();
                dbCat = inserted;
            }

            // Process articles to clean up NewsAPI content and insert into DB
            const validArticles = data.articles.filter((item: any) => item.title && item.content && item.title !== '[Removed]');
            totalProcessedCount += validArticles.length;

            const processedArticles = validArticles.map((item: any) => {
                const slug = item.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                    .slice(0, 100);

                const fallbackContent = item.description || item.title || 'No content provided.';
                let rawContent = item.content || fallbackContent;
                rawContent = rawContent.replace(/\[\+\d+ chars\]\s*$/, '').trim();

                return { item, slug, rawContent };
            });

            for (const { item, slug, rawContent } of processedArticles) {
                try {
                    await db.insert(articles).values({
                        title: item.title,
                        slug: slug,
                        content: rawContent,
                        snippet: item.description || item.title.substring(0, 100) + '...',
                        imageUrl: item.urlToImage,
                        author: item.author || 'Unknown',
                        source: item.source?.name || 'NewsAPI',
                        categoryId: dbCat.id,
                        publishedAt: item.publishedAt || new Date().toISOString(),
                        originalUrl: item.url,
                    }).onConflictDoNothing();

                    totalInsertedCount++;
                } catch (e) {
                    console.error(`Error inserting article ${slug}:`, e);
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully processed ${totalProcessedCount} articles. Inserted or updated ${totalInsertedCount} articles.`,
        });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred during sync.' },
            { status: 500 }
        );
    }
}
