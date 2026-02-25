'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export function SearchBar({ inverted = false, variant = 'icon' }: { inverted?: boolean; variant?: 'icon' | 'bar' }) {
    const [query, setQuery] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (articleSlug: string) => {
        setOpen(false);
        router.push(`/news/${articleSlug}`);
    };

    return (
        <div className={variant === 'bar' ? "flex items-center w-full max-w-lg" : "flex items-center"}>
            {variant === 'bar' ? (
                <button
                    onClick={() => setOpen(true)}
                    className={cn(
                        "flex w-full items-center gap-2 rounded-none border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-ring",
                        inverted ? "border-background text-background bg-transparent hover:text-background" : "border-foreground text-foreground bg-transparent"
                    )}
                >
                    <SearchSharpIcon className="h-4 w-4" />
                    <span className="flex-1 text-left opacity-80">Search...</span>
                    <kbd className={cn(
                        "pointer-events-none hidden h-5 select-none items-center gap-1 rounded-sm border px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex",
                        inverted ? "bg-background/20 text-background border-background/20" : "bg-muted text-foreground"
                    )}>
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </button>
            ) : (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(true)}
                    aria-label="Toggle search"
                    className={inverted ? "text-background hover:bg-white/20 hover:text-background rounded-none" : "text-foreground hover:bg-accent hover:text-accent-foreground rounded-none"}
                >
                    <SearchSharpIcon className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
            )}

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search news..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>{isSearching ? "Searching..." : "No results found."}</CommandEmpty>
                    {results.length > 0 && (
                        <CommandGroup heading="Articles">
                            {results.map((article) => (
                                <CommandItem
                                    key={article.id}
                                    value={article.title}
                                    onSelect={() => handleSelect(article.slug)}
                                    className="cursor-pointer"
                                >
                                    <div className="flex flex-col gap-1 py-1">
                                        <span className="font-semibold text-sm line-clamp-1">{article.title}</span>
                                        <span className="text-xs text-muted-foreground line-clamp-1">{article.snippet}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </div>
    );
}
