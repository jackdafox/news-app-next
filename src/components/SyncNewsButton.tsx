'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SyncSharpIcon from '@mui/icons-material/SyncSharp';
import { toast } from 'sonner';

export function SyncNewsButton() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/sync-news', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || 'Failed to sync news.');
            } else {
                toast.success(data.message || 'Sync successful.');
                router.refresh();
            }
        } catch (error) {
            toast.error('A network error occurred while syncing.');

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleSync}
            disabled={isLoading}
            title="Sync News"
        >
            <SyncSharpIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Sync News</span>
        </Button>
    );
}
