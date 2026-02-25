import { db } from '../db';
import { articles, categories } from '../db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import Fuse from 'fuse.js';

export async function getCategories() {
    return await db.select().from(categories).all();
}

export async function getLatestArticles(page = 1, limit = 10, categorySlug?: string | null) {
    const offset = (page - 1) * limit;

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

    let catId: number | null = null;
    if (categorySlug) {
        const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug)).get();
        if (cat) {
            catId = cat.id;
        }
    }

    if (catId) {
        query = query.where(eq(articles.categoryId, catId)) as any;
    }

    const items = await query.orderBy(desc(articles.publishedAt)).limit(limit).offset(offset).all();

    let countItems = 0;
    if (catId) {
        const res = await db.select({ value: count() }).from(articles).where(eq(articles.categoryId, catId)).get();
        countItems = res?.value || 0;
    } else {
        const res = await db.select({ value: count() }).from(articles).get();
        countItems = res?.value || 0;
    }

    return {
        articles: items,
        total: countItems,
        page,
        limit,
        totalPages: Math.ceil(countItems / limit) || 1
    };
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

export async function getRandomArticle() {
    return await db.select().from(articles).orderBy(sql`RANDOM()`).limit(1).get();
}
