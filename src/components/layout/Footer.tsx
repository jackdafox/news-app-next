import Link from 'next/link';

export function Footer() {
    return (
        <footer className="w-full pb-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} NewsHub. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/headlines" className="hover:text-foreground transition-colors">Headlines</Link>
                    <Link href="/surprise" className="hover:text-foreground transition-colors">Surprise Me</Link>
                </div>
            </div>
        </footer>
    );
}
