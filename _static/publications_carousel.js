document.addEventListener('DOMContentLoaded', () => {
    initPublicationCarousel();
});

function initPublicationCarousel() {
    const carousel = document.querySelector('.publications-carousel');
    const cardsList = document.querySelector('.publications-list');
    const cards = document.querySelectorAll('.publication-card');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');

    let currentIndex = 0;
    const totalCards = cards.length;

    if (!carousel || totalCards === 0) return;

    positionCards();

    // Navigation flèches
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', showPrevCard);
        nextBtn.addEventListener('click', showNextCard);
    }

    // Clic sur les cartes
    cards.forEach(card => {
        card.addEventListener('click', function () {
            if (this.classList.contains('prev')) {
                showPrevCard();
            } else if (this.classList.contains('next')) {
                showNextCard();
            } else if (this.classList.contains('active')) {
                openModal(this);
            }
        });
    });

    // Navigation clavier
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') showPrevCard();
        if (e.key === 'ArrowRight') showNextCard();
    });

    // Swipe mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) showNextCard();
        if (touchEndX > touchStartX + 50) showPrevCard();
    }

    // Positionnement des cartes
    function positionCards() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'prev', 'next');

            let position = (index - currentIndex + totalCards) % totalCards;

            const title = card.querySelector('.publication-title');
            const separator = card.querySelector('.pub-sep');
            const authors = card.querySelector('.publication-authors');
            const source = card.querySelector('.pub-source');

            if (position === 0) {
                card.classList.add('active');
                card.style.left = '50%';
                card.style.transform = 'translateX(-50%) translateY(-50%) scale(1.2)';
                card.style.opacity = '1';
                card.style.zIndex = '10';

                if (title) {
                    title.style.textAlign = 'center';
                    title.style.display = '';
                }
                if (separator) separator.style.display = 'block';
                if (authors) authors.style.display = 'block';
                if (source) source.style.display = 'block';

            } else if (position === 1 || position === totalCards - 1) {
                card.classList.add(position === 1 ? 'next' : 'prev');
                const sidePos = position === 1 ? '75%' : '25%';
                card.style.left = sidePos;
                card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';
                card.style.opacity = '0.7';
                card.style.zIndex = '5';

                if (title) {
                    title.style.display = 'flex';
                    title.style.height = '100%';
                    title.style.alignItems = 'center';
                    title.style.justifyContent = 'center';
                }
                if (separator) separator.style.display = 'none';
                if (authors) authors.style.display = 'none';
                if (source) source.style.display = 'none';

            } else {
                card.style.opacity = '0';
                card.style.zIndex = '0';
                card.style.transform = 'translateX(-50%) translateY(-50%) scale(0.5)';
            }
        });
    }

    function showPrevCard() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        positionCards();
    }

    function showNextCard() {
        currentIndex = (currentIndex + 1) % totalCards;
        positionCards();
    }

    // Auto-rotation (facultatif)
    let autoRotate = setInterval(showNextCard, 8000);
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(showNextCard, 8000);
    });
}
