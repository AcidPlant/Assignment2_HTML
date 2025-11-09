
// rating-system.js - Unified Rating System for All Pages
class RatingSystem {
    constructor() {
        this.init();
    }

    init() {
        console.log('⭐ Rating System initialized');
        this.initHomeRatings();
        this.initLibraryRatings();
        this.initAPIRatings();
        this.updateAllRatingsDisplay();
    }

    // Home page ratings
    initHomeRatings() {
        // Main rating system on home page
        const stars = document.querySelectorAll('.rating-stars .star');
        if (stars.length > 0) {
            console.log('🏠 Initializing home page ratings');

            let currentRating = window.authSystem ? window.authSystem.getRating('overall') : 0;
            this.updateStars(stars, currentRating);

            const ratingDisplay = document.getElementById('rating-display');
            if (ratingDisplay) {
                ratingDisplay.textContent = currentRating ? `Your rating: ${currentRating}/5` : 'Your rating: Not rated yet';
            }

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    if (!window.authSystem || !window.authSystem.currentUser) {
                        showNotification('Please log in to rate games', 'error');
                        return;
                    }

                    const rating = parseInt(star.getAttribute('data-rating'));
                    currentRating = rating;

                    // Save overall rating
                    if (window.authSystem.saveRating) {
                        window.authSystem.saveRating('overall', rating);
                    }

                    this.updateStars(stars, rating);

                    if (ratingDisplay) {
                        ratingDisplay.textContent = `Your rating: ${rating}/5`;
                        ratingDisplay.classList.add('text-success');
                    }

                    showNotification(`Rated ${rating} stars! ⭐`, 'success');
                    playSound();
                });

                star.addEventListener('mouseover', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    this.updateStars(stars, rating, true);
                });

                star.addEventListener('mouseout', () => {
                    this.updateStars(stars, currentRating);
                });
            });
        }

        // Card ratings on home page
        this.initCardRatings('.game-card');
    }

    // Library page ratings
    initLibraryRatings() {
        this.initCardRatings('.game-card');

        // Add rated games section to library if not exists
        if (window.location.pathname.includes('library.html') && !document.getElementById('rated-games-section')) {
            this.addRatedGamesToLibrary();
        }
    }

    // API game ratings
    initAPIRatings() {
        this.initCardRatings('.api-game-card');
    }

    // Initialize ratings for any card type
    initCardRatings(selector) {
        document.querySelectorAll(selector).forEach((card, index) => {
            const stars = card.querySelectorAll('.star-small');
            if (stars.length === 0) return;

            const gameTitle = card.querySelector('.card-title')?.textContent?.trim() || `Game ${index + 1}`;
            const gameImage = card.querySelector('img')?.src || '';
            const gameGenre = card.querySelector('.badge')?.textContent?.trim() || '';
            const gameId = card.getAttribute('data-game-id') || this.generateGameId(gameTitle);

            // Set data attributes if not present
            if (!card.getAttribute('data-game-id')) {
                card.setAttribute('data-game-id', gameId);
            }

            let currentRating = window.authSystem ? window.authSystem.getGameRating(gameId) : 0;
            this.updateCardStars(stars, currentRating);

            stars.forEach(star => {
                star.addEventListener('click', () => {
                    if (!window.authSystem || !window.authSystem.currentUser) {
                        showNotification('Please log in to rate games', 'error');
                        return;
                    }

                    const rating = parseInt(star.getAttribute('data-rating'));
                    currentRating = rating;

                    // Save game rating
                    const saved = window.authSystem.saveGameRating(gameId, gameTitle, rating, gameImage, gameGenre);

                    if (saved) {
                        this.updateCardStars(stars, rating);

                        // Update rating display
                        const ratingDisplay = card.querySelector('.rating-display-small');
                        if (ratingDisplay) {
                            ratingDisplay.textContent = `${rating}/5 ⭐`;
                            ratingDisplay.className = 'rating-display-small text-center mt-2 text-warning';
                        }

                        showNotification(`Rated "${gameTitle}" ${rating} stars! ⭐`, 'success');
                        playSound();

                        // Update library rated games section
                        if (window.location.pathname.includes('library.html')) {
                            this.updateLibraryRatedGames();
                        }
                    }
                });

                star.addEventListener('mouseover', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    this.updateCardStars(stars, rating, true);
                });

                star.addEventListener('mouseout', () => {
                    this.updateCardStars(stars, currentRating);
                });
            });
        });
    }

    // Update stars display
    updateStars(stars, rating, isHover = false) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffd700';
                star.style.textShadow = '0 0 10px gold';
                star.style.transform = 'scale(1.2)';
            } else {
                star.style.color = isHover ? '#ffd70066' : '#666';
                star.style.textShadow = 'none';
                star.style.transform = 'scale(1)';
            }
        });
    }

    // Update card stars display
    updateCardStars(stars, rating, isHover = false) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#ffd700';
                star.style.textShadow = '0 0 8px gold';
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.color = isHover ? '#ffd70066' : '#666';
                star.style.textShadow = 'none';
                star.style.transform = 'scale(1)';
            }
        });
    }

    // Generate consistent game ID
    generateGameId(gameName) {
        return gameName.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }

    // Add rated games section to library
    addRatedGamesToLibrary() {
        const libraryMain = document.querySelector('.library-main .container');
        if (!libraryMain) return;

        const ratedSection = document.createElement('section');
        ratedSection.id = 'rated-games-section';
        ratedSection.className = 'rated-games-section mb-5';
        ratedSection.innerHTML = `
            <div class="container">
                <h2 class="text-center text-danger mb-4 display-4">⭐ Your Rated Games</h2>
                <p class="text-center text-muted mb-4">Games you've rated will appear here</p>
                <div id="rated-games-container" class="row g-4">
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-dark">
                            <h4 class="text-danger">No Rated Games Yet</h4>
                            <p class="mb-3">Rate some games to see them here!</p>
                            <a href="index.html" class="btn btn-danger">Discover Games</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after carousel or at the end
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.parentNode.insertBefore(ratedSection, carousel.nextSibling);
        } else {
            libraryMain.appendChild(ratedSection);
        }

        this.updateLibraryRatedGames();
    }

    // Update library rated games display
    updateLibraryRatedGames() {
        const container = document.getElementById('rated-games-container');
        if (!container) return;

        if (!window.authSystem || !window.authSystem.currentUser) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-warning">
                        <h4 class="text-warning">Please Log In</h4>
                        <p class="mb-3">You need to be logged in to see your rated games</p>
                        <a href="auth.html" class="btn btn-danger">Login / Sign Up</a>
                    </div>
                </div>
            `;
            return;
        }

        const ratedGames = window.authSystem.getRatedGames();

        if (ratedGames.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-dark">
                        <h4 class="text-danger">No Rated Games Yet</h4>
                        <p class="mb-3">Rate some games to see them here!</p>
                        <a href="index.html" class="btn btn-danger">Discover Games</a>
                    </div>
                </div>
            `;
            return;
        }

        let html = '';
        ratedGames.sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt))
            .forEach(game => {
                const stars = '⭐'.repeat(game.rating) + '☆'.repeat(5 - game.rating);
                const ratedDate = new Date(game.ratedAt).toLocaleDateString();

                html += `
                    <div class="col-md-6 col-lg-4">
                        <div class="card bg-secondary text-white h-100 shadow">
                            <img src="${game.image || 'https://via.placeholder.com/400x250/2a2a2a/666?text=Game+Image'}" 
                                 class="card-img-top" 
                                 alt="${game.name}"
                                 style="height: 200px; object-fit: cover;"
                                 onerror="this.src='https://via.placeholder.com/400x250/2a2a2a/666?text=Game+Image'">
                            
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-danger">${game.name}</h5>
                                
                                <div class="mb-3">
                                    <div class="rating-badge bg-dark rounded p-2 text-center border border-warning">
                                        <div class="stars-large mb-1" style="font-size: 1.4rem;">${stars}</div>
                                        <small class="text-warning fw-bold">Your rating: ${game.rating}/5</small>
                                    </div>
                                </div>
                                
                                <div class="game-meta mb-3">
                                    ${game.genre ? `<span class="badge bg-danger mb-2">${game.genre}</span>` : ''}
                                    <small class="text-muted d-block">
                                        <span class="text-warning">★</span> Rated on: ${ratedDate}
                                    </small>
                                </div>
                                
                                <div class="mt-auto">
                                    <div class="btn-group w-100">
                                        <button onclick="ratingSystem.editRating('${game.id}')" 
                                                class="btn btn-outline-warning btn-sm">
                                            ✏️ Edit
                                        </button>
                                        <button onclick="ratingSystem.removeRating('${game.id}')" 
                                                class="btn btn-outline-danger btn-sm">
                                            🗑️ Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

        container.innerHTML = html;
    }

    // Edit rating
    editRating(gameId) {
        if (!window.authSystem || !window.authSystem.currentUser) return;

        const ratedGames = window.authSystem.getRatedGames();
        const game = ratedGames.find(g => g.id === gameId);

        if (game) {
            const newRating = prompt(`Edit your rating for "${game.name}" (1-5 stars):`, game.rating);

            if (newRating && parseInt(newRating) >= 1 && parseInt(newRating) <= 5) {
                window.authSystem.saveGameRating(gameId, game.name, parseInt(newRating), game.image, game.genre);
                showNotification(`Updated rating for "${game.name}" to ${newRating} stars!`, 'success');
                playSound();

                // Update displays
                this.updateLibraryRatedGames();
                this.updateAllRatingsDisplay();

                if (window.profileManager) {
                    window.profileManager.refreshProfileData();
                }
            }
        }
    }

    // Remove rating
    removeRating(gameId) {
        if (!window.authSystem || !window.authSystem.currentUser) return;

        const ratedGames = window.authSystem.getRatedGames();
        const game = ratedGames.find(g => g.id === gameId);

        if (game && confirm(`Are you sure you want to remove your rating for "${game.name}"?`)) {
            window.authSystem.removeGameRating(gameId);
            showNotification(`Removed rating for "${game.name}"`, 'info');
            playSound();

            // Update displays
            this.updateLibraryRatedGames();
            this.updateAllRatingsDisplay();

            if (window.profileManager) {
                window.profileManager.refreshProfileData();
            }
        }
    }

    // Update all ratings display on page
    updateAllRatingsDisplay() {
        // Update card ratings
        this.initCardRatings('.game-card');
        this.initCardRatings('.api-game-card');

        // Update library if on library page
        if (window.location.pathname.includes('library.html')) {
            this.updateLibraryRatedGames();
        }
    }
}

// Initialize rating system
let ratingSystem;

document.addEventListener('DOMContentLoaded', function() {
    ratingSystem = new RatingSystem();
    window.ratingSystem = ratingSystem;
});

// Make functions available globally
window.updateAllRatings = function() {
    if (window.ratingSystem) {
        window.ratingSystem.updateAllRatingsDisplay();
    }
};