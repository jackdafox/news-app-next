function renderEditorial(articles) {
    const editorialContainer = document.getElementById('newsEditorialContainer');
    if (!editorialContainer) return;

    if (articles.length === 0) {
        editorialContainer.innerHTML = `<div style="text-align:center; padding: 4rem; color: var(--muted-foreground);">No articles found.</div>`;
        return;
    }

    const topStory = articles[0];
    const secondStory = articles[1];
    const listStories = articles.slice(2, 5);
    const horizontalStories = articles.slice(5);

    let html = '';

    // TOP STORY
    if (topStory) {
        html += `
            <div class="top-story">
                <div class="cat-label">TOP STORY</div>
                <h2>${topStory.title}</h2>
                <div class="img-container">
                    <img src="${topStory.image}" alt="Img">
                </div>
                <p>${topStory.snippet}</p>
                <div class="author-label">By <span>${topStory.author}</span></div>
            </div>
        `;
    }

    // SECOND SECTION (Med + List)
    if (secondStory || listStories.length > 0) {
        html += `<div class="split-section">`;

        // Left Column: Medium Story
        if (secondStory) {
            html += `
                <div class="med-story">
                    <div class="img-container">
                        <img src="${secondStory.image}" alt="Img">
                    </div>
                    <div class="cat-label" style="text-align: left;">${secondStory.category}</div>
                    <h3>${secondStory.title}</h3>
                    <p>${secondStory.snippet}</p>
                    <div class="author-label">By <span>${secondStory.author}</span></div>
                </div>
            `;
        } else {
            html += `<div></div>`;
        }

        // Right Column: List Stories
        if (listStories.length > 0) {
            html += `<div class="list-stories">`;
            listStories.forEach(st => {
                html += `
                    <div class="list-story">
                        <div class="cat-label">${st.category}</div>
                        <h4>${st.title}</h4>
                        <div class="author-label" style="margin-top:0.5rem; font-size: 0.65rem;">By <span>${st.author}</span></div>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `</div>`;
    }

    // HORIZONTAL STORIES
    if (horizontalStories.length > 0) {
        html += `<div class="horizontal-stories">`;
        horizontalStories.forEach(st => {
            html += `
                <div class="hz-story">
                    <div class="hz-content">
                        <div class="cat-label">${st.category}</div>
                        <h3>${st.title}</h3>
                        <p>${st.snippet}</p>
                        <div class="author-label">By <span>${st.author}</span></div>
                    </div>
                    <div class="hz-img">
                        <img src="${st.image}" alt="Img">
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    editorialContainer.innerHTML = html;
}

// Attach Search Filtering Logic Event
document.addEventListener('DOMContentLoaded', () => {
    // We delay slightly to ensure nav.js injected the search input
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase();
                const activeCat = window.CURRENT_CATEGORY || 'all';
                let filtered = window.newsData;

                if (activeCat !== 'all') {
                    filtered = filtered.filter(item => item.slug === activeCat);
                }

                if (query) {
                    filtered = filtered.filter(item => item.title.toLowerCase().includes(query) || item.snippet.toLowerCase().includes(query));
                }

                renderEditorial(filtered);
            });
        }
    }, 100);
});
