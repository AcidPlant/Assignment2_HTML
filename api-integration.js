// api-integration.js - Enhanced with RAWG Links (FIXED)
console.log('🚀 API Integration loading...');

class RAWGAPI {
    constructor() {
        this.apiKey = '84fc938f57ac48cd9241edaadd2349f0';
        this.baseURL = 'https://api.rawg.io/api';
        this.adultGames = [
            'manhunt', 'postal', 'hatred', 'agony', 'lust for darkness',
            'succubus', 'seduce me', 'eroge', 'hentai', 'adult',
            'leisure suit larry', 'custer\'s revenge', 'bmx xxx',
            'Shoot Shoot My Waifu'
        ];
        console.log('🔑 API System Initialized');
    }

    async getSoulsLikeGames() {
        try {
            console.log('🎮 Fetching Souls-like games...');
            const url = `${this.baseURL}/games?key=${this.apiKey}&search=souls-like&page_size=12&ordering=-rating`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            console.log('✅ API Success:', data.results?.length, 'games');
            return data;

        } catch (error) {
            console.error('❌ API Error:', error);
            return this.getFallbackData();
        }
    }

    async searchGames(query) {
        try {
            console.log('🔍 Searching for:', query);
            const url = `${this.baseURL}/games?key=${this.apiKey}&search=${encodeURIComponent(query)}&page_size=12&ordering=-rating`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('❌ Search Error:', error);
            return this.getFallbackData();
        }
    }

    getFallbackData() {
        return {
            results: [
                {
                    id: 1,
                    slug: 'dark-souls-iii',
                    name: "Dark Souls III",
                    rating: 4.8,
                    released: "2016-04-12",
                    background_image: "https://upload.wikimedia.org/wikipedia/ru/b/bb/Dark_souls_3_cover_art.jpg",
                    platforms: [{ platform: { name: "PC" } }, { platform: { name: "PS4" } }, { platform: { name: "Xbox One" } }],
                    description_raw: "The final chapter of the legendary Dark Souls series. Face challenging bosses and explore a dying world."
                },
                {
                    id: 2,
                    slug: 'elden-ring',
                    name: "Elden Ring",
                    rating: 4.9,
                    released: "2022-02-25",
                    background_image: "https://upload.wikimedia.org/wikipedia/ru/thumb/7/7c/Elden_Ring_-_cover.jpg/330px-Elden_Ring_-_cover.jpg",
                    platforms: [{ platform: { name: "PC" } }, { platform: { name: "PS5" } }, { platform: { name: "Xbox Series X" } }],
                    description_raw: "Open world action RPG from FromSoftware. Explore the Lands Between and become the Elden Lord."
                },
                {
                    id: 3,
                    slug: 'hollow-knight',
                    name: "Hollow Knight",
                    rating: 4.7,
                    released: "2017-02-24",
                    background_image: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Hollow_Knight_first_cover_art.webp/250px-Hollow_Knight_first_cover_art.webp.png",
                    platforms: [{ platform: { name: "PC" } }, { platform: { name: "Switch" } }, { platform: { name: "PS4" } }],
                    description_raw: "2D metroidvania adventure through a forgotten bug kingdom. Challenging combat and beautiful world."
                },
                {
                    id: 4,
                    slug: 'sekiro-shadows-die-twice',
                    name: "Sekiro: Shadows Die Twice",
                    rating: 4.8,
                    released: "2019-03-22",
                    background_image: "https://images.ctfassets.net/rporu91m20dc/4eJlOep1d8z2P7pY4T9O9u/4c7e585a5c9f50d9ce4a74a8d4c5b6db/Sekiro_art.jpg",
                    platforms: [{ platform: { name: "PC" } }, { platform: { name: "PS4" } }, { platform: { name: "Xbox One" } }],
                    description_raw: "Action adventure set in feudal Japan. Master the art of the shinobi and exact your revenge."
                },
                {
                    id: 5,
                    slug: 'bloodborne',
                    name: "Bloodborne",
                    rating: 4.9,
                    released: "2015-03-24",
                    background_image: "https://image.api.playstation.com/cdn/UP9000/CUSA00900_00/v8eHeJ3QqduhQKnDdqdKfD1M2Y4M15pK.png",
                    platforms: [{ platform: { name: "PS4" } }],
                    description_raw: "Gothic horror action RPG with fast-paced combat and Lovecraftian themes."
                },
                {
                    id: 6,
                    slug: 'code-vein',
                    name: "Code Vein",
                    rating: 4.2,
                    released: "2019-09-27",
                    background_image: "https://igm.gg/_next/image?url=https%3A%2F%2Fstorage.yandexcloud.net%2Figm-s3%2FPROD%2F202408%2F5cbad147%2FCODE_VEIN_2_11zon.png&w=640&q=75",
                    platforms: [{ platform: { name: "PC" } }, { platform: { name: "PS4" } }, { platform: { name: "Xbox One" } }],
                    description_raw: "Anime-style souls-like in a post-apocalyptic world of vampires and revenants."
                }
            ]
        };
    }
}

// Create global instance
window.rawgAPI = new RAWGAPI();

// Display function with RAWG links
function displayGames(games, title) {
    console.log('🎨 Displaying games:', games.length);

    const container = document.getElementById('api-results');
    const loading = document.getElementById('api-loading');

    if (!container) {
        console.error('❌ Container #api-results not found!');
        return;
    }

    // Hide loading
    if (loading) loading.style.display = 'none';

    // Clear container
    container.innerHTML = '';

    // Add title
    const titleHTML = `
        <div class="col-12 mb-4">
            <h3 class="text-center text-warning display-6">${title}</h3>
            <p class="text-center text-muted">${games.length} games • Powered by RAWG API</p>
            <div class="text-center">
                <button class="btn btn-sm btn-outline-warning me-2" onclick="clearSearch()">
                    🔄 Clear
                </button>
                <button class="btn btn-sm btn-outline-info" onclick="loadSoulsLike()">
                    👀 Load Souls-like
                </button>
            </div>
        </div>
    `;
    container.innerHTML = titleHTML;

    // Add games
    games.forEach(game => {
        const gameId = `api-${game.id}`;
        const gameSlug = game.slug || game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const rawgUrl = `https://rawg.io/games/${gameSlug}`;
        
        const userRating = window.authSystem ? window.authSystem.getGameRating(gameId) : 0;
        const stars = userRating ? '⭐'.repeat(userRating) + '☆'.repeat(5 - userRating) : '☆☆☆☆☆';

        const gameHTML = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card bg-secondary text-white h-100 shadow">
                    <img src="${game.background_image || 'https://via.placeholder.com/400x250/2a2a2a/666?text=No+Image'}" 
                         class="card-img-top" 
                         alt="${game.name}"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x250/2a2a2a/666?text=Game+Image'">
                    
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-danger">${game.name}</h5>
                        
                        <div class="game-meta mb-2">
                            <small class="text-muted d-block">
                                <strong>Released:</strong> ${game.released ? new Date(game.released).getFullYear() : 'TBA'}
                            </small>
                            <small class="text-muted d-block">
                                <strong>Rating:</strong> ${game.rating ? game.rating.toFixed(1) : 'N/A'}/5
                            </small>
                        </div>
                        
                        <p class="card-text flex-grow-1 small text-muted">
                            ${game.description_raw ? game.description_raw.substring(0, 100) + '...' : 'No description available'}
                        </p>
                        
                        <!-- Rating System -->
                        <div class="card-rating-system mt-2 mb-3">
                            <div class="rating-label text-center mb-1">
                                <small class="text-muted">Your Rating:</small>
                            </div>
                            <div class="rating-stars-small text-center" 
                                 data-game-id="${gameId}" 
                                 data-game-name="${game.name}">
                                <span class="star-small" data-rating="1">★</span>
                                <span class="star-small" data-rating="2">★</span>
                                <span class="star-small" data-rating="3">★</span>
                                <span class="star-small" data-rating="4">★</span>
                                <span class="star-small" data-rating="5">★</span>
                            </div>
                            <div class="rating-display-small text-center mt-1">
                                <small class="${userRating ? 'text-warning' : 'text-muted'}" 
                                       id="rating-${gameId}">
                                    ${userRating ? `${userRating}/5 ${stars}` : 'Not rated'}
                                </small>
                            </div>
                        </div>
                        
                        <div class="mt-auto">
                            <div class="btn-group w-100 mb-2">
                                <button class="btn btn-danger btn-sm" 
                                        onclick="openRAWGPage('${rawgUrl}', '${game.name.replace(/'/g, "\\'")}')"
                                        title="View full details on RAWG">
                                    📖 Full Details
                                </button>
                                <button class="btn btn-outline-light btn-sm" 
                                        onclick="addToLibrary('${game.name.replace(/'/g, "\\'")}')"
                                        title="Add to your library">
                                    ➕ Library
                                </button>
                            </div>
                            <small class="text-muted d-block text-center">
                                <a href="${rawgUrl}" target="_blank" rel="noopener noreferrer" 
                                   class="text-info text-decoration-none" 
                                   title="Open ${game.name} on RAWG.io">
                                    🔗 View on RAWG.io
                                </a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += gameHTML;
    });

    // Initialize rating stars
    initRatingStars();
    console.log('✅ Games displayed successfully');
}

// Initialize rating stars
function initRatingStars() {
    document.querySelectorAll('.rating-stars-small .star-small').forEach(star => {
        star.addEventListener('click', function() {
            if (!window.authSystem?.currentUser) {
                showNotification('Please log in to rate games', 'error');
                return;
            }

            const rating = parseInt(this.getAttribute('data-rating'));
            const gameId = this.closest('.rating-stars-small').getAttribute('data-game-id');
            const gameName = this.closest('.rating-stars-small').getAttribute('data-game-name');
            const gameImage = this.closest('.card').querySelector('img').src;

            if (window.authSystem.saveGameRating(gameId, gameName, rating, gameImage)) {
                // Update stars display
                const stars = this.parentElement.querySelectorAll('.star-small');
                stars.forEach((s, index) => {
                    s.style.color = index < rating ? '#ffd700' : '#666';
                });

                // Update rating display
                const ratingDisplay = document.getElementById(`rating-${gameId}`);
                if (ratingDisplay) {
                    const starsText = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
                    ratingDisplay.textContent = `${rating}/5 ${starsText}`;
                    ratingDisplay.className = 'rating-display-small text-center mt-1 text-warning';
                }

                showNotification(`Rated "${gameName}" ${rating} stars!`, 'success');
                playSound();
            }
        });
    });
}

// Load Souls-like games
async function loadSoulsLike() {
    console.log('👀 Loading Souls-like games...');

    const loading = document.getElementById('api-loading');
    const error = document.getElementById('api-error');
    const searchInput = document.getElementById('apiSearchInput');

    if (searchInput) searchInput.value = 'souls-like';
    if (loading) loading.style.display = 'block';
    if (error) error.style.display = 'none';

    try {
        const data = await window.rawgAPI.getSoulsLikeGames();
        displayGames(data.results, "👀 Souls-like Games");
    } catch (error) {
        console.error('Load error:', error);
        if (error) {
            error.style.display = 'block';
            error.innerHTML = 'Failed to load games. Please try again.';
        }
    }
}

// Search function
async function searchGamesAPI() {
    const searchInput = document.getElementById('apiSearchInput');
    const query = searchInput?.value?.trim() || 'souls-like';

    console.log('🔍 Searching for:', query);

    const loading = document.getElementById('api-loading');
    const error = document.getElementById('api-error');

    if (loading) loading.style.display = 'block';
    if (error) error.style.display = 'none';

    try {
        const data = await window.rawgAPI.searchGames(query);
        displayGames(data.results, `Search: "${query}"`);
    } catch (error) {
        console.error('Search error:', error);
        if (error) {
            error.style.display = 'block';
            error.innerHTML = 'Search failed. Please try again.';
        }
    }
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('apiSearchInput');
    if (searchInput) searchInput.value = '';
    loadSoulsLike();
}

// NEW: Open RAWG page function
function openRAWGPage(url, gameName) {
    console.log(`🔗 Opening RAWG page for: ${gameName}`);
    window.open(url, '_blank', 'noopener,noreferrer');
    
    if (typeof playSound === 'function') {
        playSound();
    }
    if (typeof showNotification === 'function') {
        showNotification(`Opening ${gameName} on RAWG.io...`, 'info');
    }
}

// Helper functions
function showGameDetails(gameName) {
    showNotification(`Details for: ${gameName}`, 'info');
}

function addToLibrary(gameName) {
    if (!window.authSystem?.currentUser) {
        showNotification('Please log in to add games to library', 'error');
        return;
    }
    showNotification(`Added "${gameName}" to your library!`, 'success');
    playSound();
}

// Initialize when page loads - EXACT COPY FROM YOUR WORKING FILE
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing API...');

    setTimeout(() => {
        if (document.getElementById('api-results')) {
            console.log('🎯 API section found, loading games...');
            loadSoulsLike();
        }
    }, 1000);
});

// Make functions global
window.loadSoulsLike = loadSoulsLike;
window.searchGamesAPI = searchGamesAPI;
window.clearSearch = clearSearch;
window.openRAWGPage = openRAWGPage;

console.log('✅ API Integration loaded successfully');