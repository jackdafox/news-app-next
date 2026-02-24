import { notFound } from 'next/navigation';
import { db } from '@/db';
import { articles, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Globe, ExternalLink } from 'lucide-react';

interface NewsPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
    const { slug } = await params;

    // Fetch the article with its category
    const article = await db.query.articles.findFirst({
        where: eq(articles.slug, slug),
        with: {
            category: true,
        },
    });

    if (!article) {
        notFound();
    }

    const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Headlines
                </Link>
            </div>

            <header className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                    {article.category && (
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                            {article.category.name}
                        </Badge>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-4 mb-8">
                    {article.author && (
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{article.author}</span>
                        </div>
                    )}

                    {article.source && (
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="font-medium">{article.source}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={article.publishedAt}>{publishDate}</time>
                    </div>
                </div>
            </header>

            {article.imageUrl && (
                <figure className="mb-12 rounded-xl overflow-hidden border border-border/50 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-auto object-cover max-h-[600px] aspect-video"
                    />
                </figure>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-a:text-primary">
                <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-8 leading-relaxed border-l-4 border-primary pl-6">
                    {article.snippet}
                </p>

                <div
                    className="mt-8 space-y-6"
                    dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '<br/><br/>') }}
                />

                {article.originalUrl && (
                    <div className="mt-12 pt-8 border-t border-border/50">
                        <a
                            href={article.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
                        >
                            Continue Reading on {article.source || 'Original Source'}
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                )}
            </div>
        </article>
    );
}
