document.addEventListener('DOMContentLoaded', () => {
    const heroCategoryText = document.getElementById('heroCategoryText');
    const heroImagesContainer = document.getElementById('heroImagesContainer');
    if (!heroImagesContainer) return; // Only run on pages with a hero

    let currentHeroIndex = 0;
    const features = window.newsData.slice(0, 5);

    function initHero() {
        // Generate Hero cards
        features.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = `\hero-card \${idx === 0 ? 'active' : ''}\`;
            div.setAttribute('data-index', idx);
            div.innerHTML = \`
                <img src="\${item.image}" alt="\${item.title}">
                <div class="hero-overlay"></div>
                <div class="hero-card-content">
                    <h3>\${item.title}</h3>
                </div>
            \`;
            heroImagesContainer.appendChild(div);
        });

        // Animate every 5s
        setInterval(() => {
            currentHeroIndex = (currentHeroIndex + 1) % features.length;
            updateHeroVisuals();
        }, 5000);
        updateHeroVisuals(); // Initial call
    }

    function updateHeroVisuals() {
        const cards = document.querySelectorAll('.hero-card');
        
        // Update Text
        const currentItem = features[currentHeroIndex];
        if (heroCategoryText) {
            heroCategoryText.style.opacity = '0';
            heroCategoryText.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                heroCategoryText.textContent = currentItem.category;
                heroCategoryText.style.opacity = '1';
                heroCategoryText.style.transform = 'translateY(0)';
            }, 400);
        }

        // Update Cards
        cards.forEach((card, idx) => {
            const offset = (idx - currentHeroIndex + features.length) % features.length; 
            
            let yPos = 0;
            let scale = 1;
            let zIndex = 20;
            let opacity = 1;
            let isActive = false;

            if (offset === 0) {
                yPos = 0; scale = 1; zIndex = 40; opacity = 1; isActive = true;
            } else if (offset === 1 || offset === features.length - 1) {
                // Determine direction based on offset
                const direction = offset === 1 ? -1 : 1; 
                yPos = 105 * direction; scale = 0.85; zIndex = 19; opacity = 0.3;
            } else {
                const direction = offset === 2 ? -1 : 1;
                yPos = 210 * direction; scale = 0.85; zIndex = 18; opacity = 0; 
            }

            card.style.transform = \`translateY(\${yPos}%) scale(\${scale})\`;
            card.style.zIndex = zIndex;
            card.style.opacity = opacity;
            
            if (isActive) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    initHero();
});
