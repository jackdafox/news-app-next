import { db } from './index';
import { categories, articles } from './schema';

async function seed() {
    console.log('Seeding database...');

    // Insert initial categories
    const categoryData = [
        { name: 'Politics', slug: 'politics' },
        { name: 'Environmental', slug: 'environmental' },
        { name: 'Tech', slug: 'tech' },
        { name: 'Business', slug: 'business' },
        { name: 'Entertainment', slug: 'entertainment' },
    ];

    const insertedCategories = db.insert(categories).values(categoryData).returning().all();
    console.log('Categories seeded:', insertedCategories.length);

    // Insert mock articles
    const catMap = insertedCategories.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
    }, {} as Record<string, number>);

    const articleData = [
        {
            title: 'New AI Model Outperforms Humans in Coding Tasks',
            slug: 'new-ai-model-outperforms-humans',
            content: 'A groundbreaking new AI model has demonstrated superior performance in complex coding challenges compared to human developers. The model, trained on vast amounts of open-source code, can write, debug, and optimize software at unprecedented speeds.',
            snippet: 'A new AI model shows superior performance in coding challenges over humans.',
            imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            categoryId: catMap['tech'],
            publishedAt: new Date().toISOString(),
            author: 'Jane Doe',
            source: 'Tech Insider'
        },
        {
            title: 'Global Summit Reaches Agreement on Climate Action',
            slug: 'global-summit-climate-agreement',
            content: 'World leaders have finally reached a consensus on the new framework for reducing carbon emissions by 2030. The agreement includes significant investments in renewable energy infrastructure and stricter regulations on industrial pollution.',
            snippet: 'New global agreement reached on carbon emission reductions by 2030.',
            imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
            categoryId: catMap['environmental'],
            publishedAt: new Date().toISOString(),
            author: 'John Smith',
            source: 'Eco News'
        },
        {
            title: 'Elections 2026: Shift in Polling Numbers',
            slug: 'elections-2026-polling-shift',
            content: 'Recent polls show a surprising shift in voter preferences ahead of the upcoming legislative elections. Economic concerns appear to be the primary driver behind this change, with many voters prioritizing stability over rapid reform.',
            snippet: 'New polling shows significant shifts in voter preferences ahead of the elections.',
            imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800',
            categoryId: catMap['politics'],
            publishedAt: new Date().toISOString(),
            author: 'Alice Johnson',
            source: 'Daily Politics'
        },
        {
            title: 'Tech Giants Announce Unified Smart Home Standard',
            slug: 'unified-smart-home-standard',
            content: 'Major technology companies have jointly announced a new, unified standard for smart home devices, promising seamless interoperability across different brands and ecosystems. This move is expected to drastically accelerate adoption of smart home tech.',
            snippet: 'Major tech companies announce a unified standard for smart home devices.',
            imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
            categoryId: catMap['tech'],
            publishedAt: new Date().toISOString(),
            author: 'Bob Williams',
            source: 'Wired Home'
        }
    ];

    const insertedArticles = db.insert(articles).values(articleData).returning().all();
    console.log('Articles seeded:', insertedArticles.length);

    console.log('Database seeding complete!');
}

seed().catch((err) => {
    console.error('Failed to seed database:', err);
    process.exit(1);
});
