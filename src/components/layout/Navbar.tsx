import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { ModeToggle } from '@/components/ModeToggle';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold sm:inline-block text-2xl tracking-tighter text-primary">
                        NewsHub.
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <SearchBar />
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
