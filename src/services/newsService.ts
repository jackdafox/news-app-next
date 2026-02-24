import { db } from '../db';
import { articles, categories } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import Fuse from 'fuse.js';

export async function getCategories() {
    return await db.select().from(categories).all();
}

export async function getLatestArticles(limit = 10, categorySlug?: string | null) {
    let query = db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            content: articles.content,
            snippet: articles.snippet,
            imageUrl: articles.imageUrl,
            publishedAt: articles.publishedAt,
            author: articles.author,
            source: articles.source,
            category: categories,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id));

    if (categorySlug) {
        // get category
        const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug)).get();
        if (cat) {
            // It's a bit tricky to chain conditionally in drizzle without dynamic query building, 
            // but we can just use where
            query = db
                .select({
                    id: articles.id,
                    title: articles.title,
                    slug: articles.slug,
                    content: articles.content,
                    snippet: articles.snippet,
                    imageUrl: articles.imageUrl,
                    publishedAt: articles.publishedAt,
                    author: articles.author,
                    source: articles.source,
                    category: categories,
                })
                .from(articles)
                .leftJoin(categories, eq(articles.categoryId, categories.id))
                .where(eq(articles.categoryId, cat.id)) as any;
        }
    }

    return await query.orderBy(desc(articles.publishedAt)).limit(limit).all();
}

export async function searchArticlesFuzzy(searchQuery: string) {
    // A real scale app would use a dedicated search engine or Full Text Search in DB
    // For this, we fetch all articles (or a large limit) and use Fuse.js
    const allArticles = await db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            content: articles.content,
            snippet: articles.snippet,
            imageUrl: articles.imageUrl,
            publishedAt: articles.publishedAt,
            author: articles.author,
            source: articles.source,
            category: categories,
        })
        .from(articles)
        .leftJoin(categories, eq(articles.categoryId, categories.id))
        .all();

    const fuse = new Fuse(allArticles, {
        keys: ['title', 'snippet', 'content', 'category.name'],
        includeScore: true,
        threshold: 0.4 // Adjust threshold for fuzziness
    });

    const exactMatches = fuse.search(searchQuery);
    return exactMatches.map(m => m.item);
}
