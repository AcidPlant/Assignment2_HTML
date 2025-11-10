// profile.js - Fixed Profile Page with Theme Support
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('👤 Profile Manager initialized');

        // Apply theme first
        this.applyTheme();

        // Check authentication
        this.checkAuthentication();

        // Load profile data if user is logged in
        if (this.currentUser) {
            this.loadProfileData();
            this.displayRatedGames();
            this.updateStats();
        }

        // Update navigation
        this.updateNavigation();

        // Initialize theme toggle
        this.initThemeToggle();
    }

    applyTheme() {
        const savedTheme = localStorage.getItem('theme') || 'night';
        const root = document.documentElement;

        const themes = {
            day: {
                '--dark-bg': '#f8f9fa',
                '--darker-bg': '#ffffff',
                '--dark-secondary': '#e9ecef',
                '--text-light': '#212529',
                '--text-gray': '#6c757d',
                '--border-dark': '#dee2e6'
            },
            night: {
                '--dark-bg': '#0a0a0a',
                '--darker-bg': '#1a1a1a',
                '--dark-secondary': '#2a2a2a',
                '--text-light': '#e0e0e0',
                '--text-gray': '#b0b0b0',
                '--border-dark': '#333'
            }
        };

        const theme = themes[savedTheme];
        Object.keys(theme).forEach(key => {
            root.style.setProperty(key, theme[key]);
        });

        // Add theme class to body
        document.body.className = savedTheme + '-mode';
    }

    initThemeToggle() {
        // Add theme toggle button to profile if not exists
        if (!$('#profile-theme-toggle').length && $('#profile-content').is(':visible')) {
            const themeToggle = `
                <div class="text-center mt-4">
                    <button id="profile-theme-toggle" class="btn btn-outline-danger">
                        ${localStorage.getItem('theme') === 'day' ? '🌙 Switch to Night Mode' : '☀️ Switch to Day Mode'}
                    </button>
                </div>
            `;
            $('.stats-section').after(themeToggle);

            $('#profile-theme-toggle').on('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'night';
        const newTheme = currentTheme === 'night' ? 'day' : 'night';

        // Apply new theme
        this.applyTheme();
        localStorage.setItem('theme', newTheme);

        // Update toggle button text
        if ($('#profile-theme-toggle').length) {
            $('#profile-theme-toggle').text(
                newTheme === 'day' ? '🌙 Switch to Night Mode' : '☀️ Switch to Day Mode'
            );
        }

        // Update navbar theme toggle if exists
        if ($('#theme-toggle-nav').length) {
            $('#theme-toggle-nav').html(newTheme === 'night' ? '🌙' : '☀️');
        }

        showNotification(`${newTheme === 'day' ? 'Day' : 'Night'} mode activated!`, 'success');
        playSound();
    }

    checkAuthentication() {
        console.log('🔐 Checking authentication status...');

        // Debug localStorage
        console.log('💾 currentUser in localStorage:', localStorage.getItem('currentUser'));
        console.log('💾 soulslike_users in localStorage:', localStorage.getItem('soulslike_users'));

        const savedUser = localStorage.getItem('currentUser');

        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('✅ User authenticated:', this.currentUser);

                // Verify user exists in users array
                const users = JSON.parse(localStorage.getItem('soulslike_users')) || [];
                const userExists = users.find(u => u.id === this.currentUser.id);

                if (!userExists) {
                    console.error('❌ User not found in users array');
                    this.showLoginRequired();
                    return;
                }

                $('#profile-content').show();
                $('#login-required').hide();

                // Load profile data
                this.loadProfileData();
                this.displayRatedGames();
                this.updateStats();

            } catch (error) {
                console.error('❌ Error parsing user data:', error);
                this.showLoginRequired();
            }
        } else {
            this.showLoginRequired();
        }
    }

    showLoginRequired() {
        this.currentUser = null;
        $('#profile-content').hide();
        $('#login-required').show();

        console.log('❌ User not authenticated - showing login required message');
    }

    loadProfileData() {
        if (!this.currentUser) return;

        try {
            // Basic profile info
            $('#profile-name').text(this.currentUser.name);
            $('#profile-email').text(this.currentUser.email);

            // Avatar - first letter of name
            const avatar = this.currentUser.name.charAt(0).toUpperCase();
            $('#profile-avatar').text(avatar);

            // Member since date
            const joinDate = new Date(this.currentUser.joinDate);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            $('#member-since').text(`Member since ${joinDate.toLocaleDateString('en-US', options)}`);

        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    }

    displayRatedGames() {
        const container = $('#profile-rated-games');
        const noGamesMessage = $('#no-rated-games');

        if (!this.currentUser || !this.currentUser.ratedGames || this.currentUser.ratedGames.length === 0) {
            container.hide();
            noGamesMessage.show();
            return;
        }

        const ratedGames = this.currentUser.ratedGames;

        container.show();
        noGamesMessage.hide();

        let html = '';

        // Sort by rating date (newest first)
        ratedGames.sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt))
            .forEach(game => {
                const stars = '⭐'.repeat(game.rating) + '☆'.repeat(5 - game.rating);
                const ratedDate = new Date(game.ratedAt).toLocaleDateString();

                html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card bg-secondary text-white h-100 shadow game-card">
                        <img src="${game.image || 'https://via.placeholder.com/400x250/2a2a2a/666?text=Game+Image'}" 
                             class="card-img-top" 
                             alt="${game.name}"
                             style="height: 200px; object-fit: cover;"
                             onerror="this.src='https://via.placeholder.com/400x250/2a2a2a/666?text=Game+Image'">
                        
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-danger">${game.name}</h5>
                            
                            <!-- Rating Display -->
                            <div class="mb-3">
                                <div class="bg-dark rounded p-2 text-center border border-warning">
                                    <div class="mb-2" style="font-size: 1.4rem;">${stars}</div>
                                    <div class="text-warning fw-bold">${game.rating}/5 Stars</div>
                                </div>
                            </div>
                            
                            <!-- Game Info -->
                            <div class="game-meta mb-3">
                                ${game.genre ? `<span class="badge bg-danger mb-2">${game.genre}</span>` : ''}
                                <small class="text-muted d-block">
                                    <span class="text-warning">★</span> Rated on: ${ratedDate}
                                </small>
                            </div>
                            
                            <!-- Actions -->
                            <div class="mt-auto">
                                <div class="btn-group w-100">
                                    <button onclick="profileManager.editGameRating('${game.id}')" 
                                            class="btn btn-outline-warning btn-sm">
                                        ✏️ Edit
                                    </button>
                                    <button onclick="profileManager.removeGameRating('${game.id}')" 
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

        container.html(html);
    }

    updateStats() {
        if (!this.currentUser) return;

        const ratedGames = this.currentUser.ratedGames || [];

        // Total games rated
        $('#total-rated').text(ratedGames.length);

        // Average rating
        if (ratedGames.length > 0) {
            const totalRating = ratedGames.reduce((sum, game) => sum + game.rating, 0);
            const averageRating = (totalRating / ratedGames.length).toFixed(1);
            $('#average-rating').text(averageRating);
        } else {
            $('#average-rating').text('0.0');
        }

        // Days as member
        const joinDate = new Date(this.currentUser.joinDate);
        const today = new Date();
        const daysAsMember = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
        $('#total-days').text(Math.max(1, daysAsMember));
    }

   editGameRating(gameId) {
    if (!window.authSystem || !window.authSystem.currentUser) return;

    const currentUser = window.authSystem.currentUser;
    const game = currentUser.ratedGames.find(g => g.id === gameId);

    if (game) {
        const newRating = prompt(`Edit your rating for "${game.name}" (1-5 stars):`, game.rating);

        if (newRating && parseInt(newRating) >= 1 && parseInt(newRating) <= 5) {
            window.authSystem.saveGameRating(gameId, game.name, parseInt(newRating), game.image, game.genre);

            showNotification(`Updated rating for "${game.name}" to ${newRating} stars!`, 'success');
            playSound();

            // Refresh UI
            this.currentUser = window.authSystem.currentUser;
            this.refreshProfileData();
        }
    }
}


   removeGameRating(gameId) {
    // Get the latest currentUser from authSystem
    if (!window.authSystem || !window.authSystem.currentUser) return;

    const currentUser = window.authSystem.currentUser;
    const ratedGames = currentUser.ratedGames || [];
    const game = ratedGames.find(g => g.id === gameId);

    if (game && confirm(`Are you sure you want to remove your rating for "${game.name}"?`)) {
        // Remove from authSystem
        window.authSystem.removeGameRating(gameId);

        // Show notification
        showNotification(`Removed rating for "${game.name}"`, 'info');
        playSound();

        // Sync ProfileManager's currentUser
        this.currentUser = window.authSystem.currentUser;

        // Refresh UI
        this.refreshProfileData();
    }
}


    refreshProfileData() {
        this.currentUser = window.authSystem.currentUser;
        this.loadProfileData();
        this.displayRatedGames();
        this.updateStats();
    }

    updateNavigation() {
        const authLink = $('#auth-link');
        const authText = $('#auth-text');

        if (this.currentUser) {
            authText.text(this.currentUser.name);
            authLink.attr('href', 'profile.html');
        } else {
            authText.text('Login');
            authLink.attr('href', 'auth.html');
        }
    }
}

// Global functions
function logout() {
    if (window.authSystem) {
        window.authSystem.logout();
    } else {
        // Fallback logout
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html'; // Redirect to index instead of auth
    }

    // Always redirect to index after logout
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Helper function for notifications
function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback notification
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// Helper function for sounds
function playSound() {
    if (typeof window.playSound === 'function') {
        window.playSound();
    }
}

// Initialize profile manager
let profileManager;

$(document).ready(function() {
    profileManager = new ProfileManager();
    window.profileManager = profileManager;
});
