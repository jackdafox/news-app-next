const newsData = [
    {
        id: "hero1",
        category: "Tech",
        slug: "tech",
        title: "The Dawn of Quantum Computing",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        snippet: "Tech giants have just released the first consumer-grade quantum processors. Expert analysts suggest a complete paradigm shift.",
        author: "ALEX CHEN",
    },
    {
        id: "hero2",
        category: "Environment",
        slug: "environment",
        title: "Global Summit Reaches Historic Deal",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        snippet: "World leaders agree on a binding resolution to aggressively cut carbon emissions down by 60% before 2030 in an unprecedented cooperative effort.",
        author: "SARAH JENKINS",
    },
    {
        id: "hero3",
        category: "Politics",
        slug: "politics",
        title: "New Parliamentary Coalition Shifts Balance",
        image: "https://images.unsplash.com/photo-1541872520847-aefb197abf08?w=800&q=80",
        snippet: "A surprising alliance has formed in the capital, promising sweeping reforms to the current economic policies and national infrastructure projects.",
        author: "DAVID RODRIGUEZ",
    },
    {
        id: "hero4",
        category: "Tech",
        slug: "tech",
        title: "AI Models Now Writing Production Code autonomously",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
        snippet: "The latest breakthrough in AI coding assistants allows entire software architectures to be generated without human intervention, sparking debate.",
        author: "MARIA GOMEZ",
    },
    {
        id: "hero5",
        category: "Environment",
        slug: "environment",
        title: "Ocean Cleanup Project Removes 1M Tons",
        image: "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80",
        snippet: "Autonomous drones and specialized sea nets have successfully restored a massive section of the Pacific garbage patch to its natural state.",
        author: "LI WEI",
    },
    {
        id: "hero6",
        category: "Politics",
        slug: "politics",
        title: "Tax Reforms Proposed to Foster Startup Growth",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
        snippet: "The newly proposed budget includes massive tax reliefs for early-stage tech startups aimed at boosting national innovation and economic resilience.",
        author: "JOHN SMITH",
    }
];

// Export to global window so other scripts can read it
window.newsData = newsData;
