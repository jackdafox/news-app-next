'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { ModeToggle } from '@/components/ModeToggle';
import { SyncNewsButton } from '@/components/SyncNewsButton';
import { cn } from '@/lib/utils';
import MenuSharpIcon from '@mui/icons-material/MenuSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { useState, useEffect, Suspense } from 'react';

function TopTierCategories() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentCategory = searchParams.get('category');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.categories || []))
            .catch(err => console.error('Failed to load categories', err));
    }, []);

    return (
        <div className="hidden lg:flex justify-center items-center py-3 px-4 gap-6 text-[15px] font-medium border-b border-border/40 text-foreground overflow-x-auto whitespace-nowrap">
            <Link
                href="/headlines"
                className={cn(
                    "hover:text-primary transition-colors",
                    pathname === '/headlines' && !currentCategory && "text-primary font-bold"
                )}
            >
                All News
            </Link>
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/headlines?category=${cat.slug}`}
                    className={cn(
                        "hover:text-primary transition-colors",
                        currentCategory === cat.slug && "text-primary font-bold"
                    )}
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    );
}

function MegaMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.categories || []))
            .catch(err => console.error('Failed to load categories', err));
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] bg-background transform transition-transform duration-500 ease-in-out overflow-y-auto flex flex-col",
                isOpen ? "translate-y-0" : "-translate-y-full"
            )}
        >
            {/* Top Bar for Dropdown */}
            <div className="w-full bg-foreground text-background flex-shrink-0">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-[60px] items-center justify-between">
                        <div className="flex flex-1 items-center justify-start mt-1 ">
                            <Link href="/" onClick={onClose}>
                                <span className="font-extrabold text-3xl md:text-3xl tracking-tighter text-background hover:text-background/80 transition-colors" style={{ fontFamily: 'var(--font-eb-garamond), serif', fontStyle: 'italic', letterSpacing: '-0.07em', transform: 'scaleY(1.15)', display: 'inline-block' }}>
                                    NewsHub
                                </span>
                            </Link>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                            <SearchBar inverted={true} variant="bar" />
                        </div>
                        <div className="flex flex-1 items-center justify-end">
                            <button
                                onClick={onClose}
                                className="text-background hover:text-primary transition-colors p-1"
                                aria-label="Close menu"
                            >
                                <CloseSharpIcon className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <div className="container mx-auto px-4 py-12 md:px-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Column 1: Landing Page & Surprise Me */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 border-b pb-2">Navigation</h3>
                            <ul className="space-y-3 font-medium text-foreground/80">
                                <li>
                                    <Link href="/" className="hover:text-primary transition-colors block" onClick={onClose}>
                                        Landing Page
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/surprise" className="hover:text-primary transition-colors block" onClick={onClose}>
                                        Surprise Me ✨
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 2: Today's Headlines Categories (split across 3 cols if needed) */}
                    <div className="col-span-1 md:col-span-3">
                        <Link href="/headlines" className="text-xl font-bold mb-4 border-b pb-2 hover:text-primary transition-colors inline-block" onClick={onClose}>
                            Today&apos;s Headlines <span className="text-sm font-normal text-muted-foreground ml-2">(View All)</span>
                        </Link>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-3 font-medium text-foreground/80 mt-4">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/headlines?category=${cat.slug}`}
                                        className="hover:text-primary transition-colors block"
                                        onClick={onClose}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 w-full bg-background font-sans">
            {/* Top Tier: Categories analogous to Film TV What To Watch etc */}
            <Suspense fallback={<div className="h-[49px] border-b border-border/40" />}>
                <TopTierCategories />
            </Suspense>

            {/* Middle Tier: Logo and Actions */}
            <div className="w-full border-b border-foreground relative z-50 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-[100px] items-center justify-between relative">

                        {/* Left Section: Menu, Search, Link Links */}
                        <div className="flex flex-1 items-center gap-4">
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2 rounded-none"
                                aria-label="Open menu"
                            >
                                <MenuSharpIcon className="w-8 h-8" />
                            </button>
                            <SearchBar />
                        </div>

                        {/* Center Section: Logo */}
                        <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <Link href="/">
                                <span className="font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter text-foreground mb-5" style={{ fontFamily: 'var(--font-eb-garamond), serif', fontStyle: 'italic', letterSpacing: '-0.07em', transform: 'scaleY(1.15)', display: 'inline-block' }}>
                                    NewsHub
                                </span>
                            </Link>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-1 items-center justify-end gap-3 text-[15px] font-medium">
                            <SyncNewsButton />
                            <ModeToggle />
                        </div>

                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            <MegaMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
}
