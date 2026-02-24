import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ArticleProps {
    article: {
        id: number;
        title: string;
        slug: string;
        content: string;
        snippet: string;
        imageUrl: string | null;
        publishedAt: string;
        author: string | null;
        source: string | null;
        category?: {
            id: number;
            name: string;
            slug: string;
        } | null;
    };
}

export function ArticleCard({ article }: ArticleProps) {
    const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <Card className="overflow-hidden flex flex-col transition-all hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm group" id={`article-${article.id}`}>
            {article.imageUrl && (
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                    {article.category && (
                        <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                            {article.category.name}
                        </Badge>
                    )}
                    <span className="text-xs text-muted-foreground font-medium">{date}</span>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors">
                    <Link href={`/news/${article.slug}`}>
                        {article.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.snippet}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold">{article.source || article.author || 'NewsHub'}</div>
                </div>
                <Link href={`/news/${article.slug}`} className="text-xs font-medium text-primary hover:underline underline-offset-4">
                    Read more
                </Link>
            </CardFooter>
        </Card>
    );
}
