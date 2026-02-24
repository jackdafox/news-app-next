import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../app/page';

// Mock fetch
global.fetch = vi.fn((url) => {
    if (url === '/api/categories') {
        return Promise.resolve({
            json: () => Promise.resolve({ categories: [{ id: 1, name: 'Politics', slug: 'politics' }] })
        });
    }
    if (url.toString().startsWith('/api/news')) {
        return Promise.resolve({
            json: () => Promise.resolve({ articles: [] })
        });
    }
    return Promise.resolve({ json: () => Promise.resolve({}) });
}) as unknown as typeof fetch;

describe('Home Page', () => {
    it('renders the header correctly', async () => {
        render(<Home />);

        // Header text
        expect(screen.getByText("Today's Headlines")).toBeTruthy();
        expect(screen.getByText("Discover the most important stories happening right now, curated specially for you.")).toBeTruthy();

        // Initial loading state
        expect(screen.getByText("Loading articles...")).toBeTruthy();

        // Wait for the articles to load (mock resolves immediately)
        await screen.findByText('No articles found');
    });
});
