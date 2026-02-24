'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';

export function SearchBar() {
    const [query, setQuery] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.articles || []);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search news..."
                    className="pl-8 bg-muted/50 focus-visible:ring-1 transition-all"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query) setIsOpen(true);
                    }}
                />
            </div>

            {isOpen && query && (
                <div className="absolute top-12 left-0 w-full bg-background border rounded-md shadow-lg overflow-hidden z-50">
                    {isSearching ? (
                        <div className="p-4 text-sm text-center text-muted-foreground">Searching...</div>
                    ) : results.length > 0 ? (
                        <ul className="max-h-[300px] overflow-auto">
                            {results.map((article) => (
                                <li key={article.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                    <Link
                                        href={`#article-${article.id}`}
                                        className="block p-3"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="font-medium text-sm line-clamp-1">{article.title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{article.snippet}</div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-sm text-center text-muted-foreground">No results found for &quot;{query}&quot;</div>
                    )}
                </div>
            )}
        </div>
    );
}
