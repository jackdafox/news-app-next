'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard } from '@/components/news/ArticleCard';
import { Badge } from '@/components/ui/badge';
import FirstPageSharpIcon from '@mui/icons-material/FirstPageSharp';
import LastPageSharpIcon from '@mui/icons-material/LastPageSharp';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

function HeadlinesContent() {
  const searchParams = useSearchParams();
  const routerCategory = searchParams.get('category');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [articles, setArticles] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(routerCategory);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const visiblePages = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let startPage = Math.max(1, currentPage - 2);
    let endPage = startPage + 4;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - 4);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  })();

  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Sync state if category changes in URL parameter
  useEffect(() => {
    setSelectedCategory(routerCategory);
  }, [routerCategory]);

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
    let url = selectedCategory
      ? `/api/news?category=${selectedCategory}`
      : '/api/news';

    url += (url.includes('?') ? '&' : '?') + `page=${currentPage}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load articles', err);
        setLoading(false);
      });
  }, [selectedCategory, currentPage]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-screen-xl font-sans text-foreground">
      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading articles...</div>
      ) : articles.length > 0 ? (
        <>
          {(() => {
            const topStory = articles[0];
            const secondStory = articles[1];
            const listStories = articles.slice(2, 5);
            const horizontalStories = articles.slice(5);

            return (
              <div className="w-full flex flex-col">
                {/* Top Story */}
                {topStory && (
                  <div className="mb-12 border-b border-foreground pb-8">
                    <div className="text-center mb-2 text-primary font-bold text-[10px] tracking-widest uppercase">
                      {currentPage === 1 ? 'TOP STORY' : (topStory.category?.name || 'NEWS')}
                    </div>
                    <Link href={`/news/${topStory.slug}`} className="block text-center group">
                      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 group-hover:text-primary transition-colors leading-[1.1] tracking-tight">
                        {topStory.title}
                      </h2>
                      {topStory.imageUrl && (
                        <div className="relative w-full aspect-[21/9] md:h-[500px] mb-6 overflow-hidden bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={topStory.imageUrl} alt={topStory.title} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <p className="text-xl md:text-2xl font-light text-foreground max-w-4xl mx-auto mb-4 leading-relaxed">
                        {topStory.snippet}
                      </p>
                      <div className="text-xs font-mono text-muted-foreground uppercase opacity-80 space-x-1">
                        By <span className="font-semibold">{topStory.author || 'Unknown'}</span>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Second Section: Left Medium Story + Right List Stories */}
                {(secondStory || listStories.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 border-b border-foreground pb-8">
                    {/* Left Column (Medium Story) */}
                    {secondStory && (
                      <div className="col-span-1 lg:col-span-2">
                        <Link href={`/news/${secondStory.slug}`} className="block group">
                          {secondStory.imageUrl && (
                            <div className="relative w-full aspect-video mb-4 overflow-hidden bg-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={secondStory.imageUrl} alt={secondStory.title} className="object-cover w-full h-full" />
                            </div>
                          )}
                          <div className="text-primary font-bold text-xs uppercase mb-2 mt-4">
                            {secondStory.category?.name || 'News'}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors leading-[1.15] tracking-tight">
                            {secondStory.title}
                          </h3>
                          <p className="text-foreground/80 mb-4 text-sm leading-relaxed max-w-2xl">
                            {secondStory.snippet}
                          </p>
                          <div className="text-xs font-mono text-muted-foreground uppercase opacity-80">
                            By <span className="font-semibold">{secondStory.author || 'Unknown'}</span>
                          </div>
                        </Link>
                      </div>
                    )}

                    {/* Right Column (List Stories) */}
                    {listStories.length > 0 && (
                      <div className="col-span-1 lg:border-l lg:border-border lg:pl-8 flex flex-col justify-between">
                        {listStories.map((article, idx) => (
                          <div key={article.id} className={idx !== 0 ? 'border-t border-border pt-6 mt-6' : ''}>
                            <Link href={`/news/${article.slug}`} className="block group">
                              <div className="text-primary font-bold text-xs uppercase mb-2">
                                {article.category?.name || 'News'}
                              </div>
                              <h4 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                                {article.title}
                              </h4>
                              <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-80 mt-3">
                                By <span className="font-semibold">{article.author || 'Unknown'}</span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Third Section: Horizontal Stories */}
                {horizontalStories.length > 0 && (
                  <div className="flex flex-col gap-8">
                    {horizontalStories.map((article) => (
                      <div key={article.id} className="border-b border-border pb-8 last:border-0 hover:bg-muted/30 transition-colors -mx-4 px-4 rounded-none">
                        <Link href={`/news/${article.slug}`} className="flex flex-col md:flex-row gap-6 group items-start">
                          <div className="flex-1 order-2 md:order-1 pt-2">
                            <div className="text-primary font-bold text-xs uppercase mb-2">
                              {article.category?.name || 'News'}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                              {article.title}
                            </h3>
                            <p className="text-foreground/80 mb-4 text-sm leading-relaxed max-w-2xl">
                              {article.snippet}
                            </p>
                            <div className="text-xs font-mono text-muted-foreground uppercase opacity-80">
                              By <span className="font-semibold">{article.author || 'Unknown'}</span>
                            </div>
                          </div>
                          {article.imageUrl && (
                            <div className="order-1 md:order-2 w-full md:w-1/3 max-w-[300px] aspect-[4/3] relative bg-muted shrink-0 rounded-none overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={article.imageUrl} alt={article.title} className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50 px-2' : 'px-2'}
                      aria-label="Go to first page"
                      size="default"
                    >
                      <FirstPageSharpIcon className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(p => p - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>

                  {visiblePages.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(p => p + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(totalPages);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50 px-2' : 'px-2'}
                      aria-label="Go to last page"
                      size="default"
                    >
                      <LastPageSharpIcon className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <h3 className="text-xl font-medium mb-2">No articles found</h3>
          <p className="text-muted-foreground">There are no articles available in this category.</p>
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-8 max-w-screen-2xl">
        <div className="text-center py-20 text-muted-foreground">Loading Headlines...</div>
      </main>
    }>
      <HeadlinesContent />
    </Suspense>
  );
}
