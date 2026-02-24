'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string; expectedApiKey?: boolean } | null>(null);

    const handleSync = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/admin/sync-news', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) {
                setResult({
                    success: false,
                    message: data.error || 'Failed to sync news.',
                    expectedApiKey: data.error?.includes('NEWS_API_KEY')
                });
            } else {
                setResult({
                    success: true,
                    message: data.message || 'Sync successful.',
                });
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'A network error occurred while syncing.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-12 max-w-2xl">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage your application content</p>
                    </div>
                    <Link href="/" className="text-sm font-medium text-primary hover:underline">
                        Back to site
                    </Link>
                </div>
            </header>

            <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Sync Headlines</CardTitle>
                    <CardDescription>
                        Fetch the latest top headlines from NewsAPI and save them to your local database.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result && (
                        <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}>
                            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                            <AlertDescription>
                                {result.message}
                                {result.expectedApiKey && (
                                    <div className="mt-2 text-sm font-semibold bg-destructive/10 p-2 rounded border border-destructive/20">
                                        Please create a <code>.env.local</code> file in your project root with your key:
                                        <div className="mt-1 bg-background text-foreground p-2 rounded">
                                            NEWS_API_KEY=your_actual_key_here
                                        </div>
                                    </div>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                    <p className="text-sm text-muted-foreground">
                        This action will connect to the external API, map the results, and ignore duplicates based on the article title.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSync}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sync Latest News
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
