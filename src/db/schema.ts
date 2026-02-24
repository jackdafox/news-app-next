import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const categories = sqliteTable('categories', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const articles = sqliteTable('articles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    snippet: text('snippet').notNull(),
    imageUrl: text('image_url'),
    categoryId: integer('category_id')
        .notNull()
        .references(() => categories.id),
    publishedAt: text('published_at').notNull(),
    author: text('author'),
    source: text('source'),
    originalUrl: text('original_url'),
    createdAt: text('created_at')
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
    articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
    category: one(categories, {
        fields: [articles.categoryId],
        references: [categories.id],
    }),
}));
