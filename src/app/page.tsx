'use client';

import { useEffect, useState } from 'react';
import { ArticleCard } from '@/components/news/ArticleCard';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [articles, setArticles] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    // Fetch articles (all or filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setLoading(true);
    const url = selectedCategory
      ? `/api/news?category=${selectedCategory}`
      : '/api/news';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load articles', err);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
          Today&apos;s Headlines
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Discover the most important stories happening right now, curated specially for you.
        </p>
      </header>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="cursor-pointer text-sm px-4 py-1"
          onClick={() => setSelectedCategory(null)}
        >
          All News
        </Badge>
        {categories.map(cat => (
          <Badge
            key={cat.id}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            className="cursor-pointer text-sm px-4 py-1"
            onClick={() => setSelectedCategory(cat.slug)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading articles...</div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">There are no articles available in this category.</p>
        </div>
      )}
    </main>
  );
}
