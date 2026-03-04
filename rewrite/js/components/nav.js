function renderNavbar() {
    const navRoot = document.getElementById('nav-root');
    if (!navRoot) return;

    navRoot.innerHTML = `
        <!-- Top Tier Categories -->
        <div class="top-nav">
            <div class="top-nav-container">
                <a href="index.html" class="top-nav-link" data-category="home">Home</a>
                <a href="all-news.html" class="top-nav-link" data-category="all">All News</a>
                <a href="tech.html" class="top-nav-link" data-category="tech">Tech</a>
                <a href="politics.html" class="top-nav-link" data-category="politics">Politics</a>
            </div>
        </div>

        <!-- Main Navbar -->
        <nav class="main-nav">
            <div class="nav-container">
                <!-- Left: Menu & Search -->
                <div class="nav-left">
                    <button class="menu-btn" aria-label="Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" class="icon" stroke="currentColor" stroke-width="2" stroke-linecap="square"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <div class="search-bar">
                        <input type="text" id="searchInput" placeholder="Search news...">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>

                <!-- Center: Logo -->
                <div class="nav-center">
                    <a href="index.html" class="logo">NewsHub</a>
                </div>

                <!-- Right: Actions -->
                <div class="nav-right">
                    <button id="themeToggle" class="theme-btn" aria-label="Toggle Theme">
                        <!-- Sun Icon -->
                        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        <!-- Moon Icon -->
                        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </button>
                </div>
            </div>
        </nav>
    `;

    // Set Active State based on current URL
    const pathname = window.location.pathname;
    let currentCategory = 'home';
    if (pathname.includes('all-news')) currentCategory = 'all';
    if (pathname.includes('tech')) currentCategory = 'tech';
    if (pathname.includes('politics')) currentCategory = 'politics';

    const activeLink = document.querySelector(`.top-nav-link[data-category="${currentCategory}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Setup Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme');
            root.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
            localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // Load persisted theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', renderNavbar);
