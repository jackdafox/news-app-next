import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getLatestArticles } from '@/services/newsService';
import { AnimatedHero, HeroFeature } from '@/components/home/AnimatedHero';

export default async function LandingPage() {
  const latestNews = await getLatestArticles(1, 20);

  // Extract unique categories for the hero scroll
  const uniqueCategories = new Map<string, HeroFeature>();

  if (latestNews.articles) {
    for (const article of latestNews.articles) {
      if (article.category && !uniqueCategories.has(article.category.name)) {
        uniqueCategories.set(article.category.name, {
          category: article.category.name,
          slug: article.category.slug,
          title: article.title,
          image: article.imageUrl || null,
          articleSlug: article.slug,
        });

        if (uniqueCategories.size >= 6) {
          break; // Let's grab up to 6 unique categories for the homepage
        }
      }
    }
  }

  const features = Array.from(uniqueCategories.values());

  return (
    <main className="flex-1 flex flex-col bg-background">
      {features.length > 0 ? (
        <AnimatedHero features={features} />
      ) : (
        <section className="container px-4 py-24 mx-auto md:py-32 flex flex-col items-center text-center max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 pb-2">
            NewsHub.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            Your premium destination for the latest headlines across the globe.
          </p>
        </section>
      )}

    </main>
  );
}
