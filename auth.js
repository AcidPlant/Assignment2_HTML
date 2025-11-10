// auth.js - Simple and Working Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('soulslike_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        console.log('🔄 Auth System Initialized');
        console.log('📊 Users in storage:', this.users);
        console.log('👤 Current user:', this.currentUser);

        this.setupEventListeners();
        this.updateUI();

        // Auto-redirect if already logged in
        if (this.currentUser && window.location.pathname.includes('auth.html')) {
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        }
    }

    setupEventListeners() {
        // Login form
        $(document).on('submit', '#loginForm', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Signup form
        $(document).on('submit', '#signupForm', (e) => {
            e.preventDefault();
            this.handleSignup();
        });

        // Password toggle
        $(document).on('click', '.password-toggle-icon', function() {
            const field = $(this).siblings('input')[0];
            if (field.type === 'password') {
                field.type = 'text';
                $(this).text('🙈');
            } else {
                field.type = 'password';
                $(this).text('👁️');
            }
        });

        // Real-time password validation
        $(document).on('input', '#signup-password', () => {
            this.validatePasswordRealTime();
        });

        $(document).on('input', '#signup-confirm', () => {
            this.validatePasswordMatch();
        });
    }

    handleLogin() {
        console.log('🔐 Attempting login...');

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val().trim();

        this.clearErrors();

        // Basic validation
        if (!email) {
            this.showError('login-email', 'Email is required');
            return;
        }

        if (!password) {
            this.showError('login-password', 'Password is required');
            return;
        }

        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);

        if (user) {
            console.log('✅ Login successful:', user.name);
            this.login(user);
        } else {
            console.log('❌ Login failed: Invalid credentials');
            this.showError('login-password', 'Invalid email or password');
        }
    }

    handleSignup() {
        console.log('📝 Attempting signup...');

        const name = $('#signup-name').val().trim();
        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val();
        const confirmPassword = $('#signup-confirm').val();

        this.clearErrors();

        // Validation
        if (!name || name.length < 2) {
            this.showError('signup-name', 'Name must be at least 2 characters');
            return;
        }

        if (!email) {
            this.showError('signup-email', 'Email is required');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showError('signup-email', 'Please enter a valid email');
            return;
        }

        // Check if email exists
        if (this.users.find(u => u.email === email)) {
            this.showError('signup-email', 'Email already registered');
            return;
        }

        if (!this.validatePassword(password)) {
            this.showError('signup-password', 'Password must be 8+ characters with uppercase, lowercase, and number');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('signup-confirm', 'Passwords do not match');
            return;
        }

        // Create user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            joinDate: new Date().toISOString(),
            ratings: {},
            ratedGames: []
        };

        console.log('👤 Creating user:', newUser);

        // Save user
        this.users.push(newUser);
        this.saveUsers();

        // Login immediately
        this.login(newUser);

        this.showSuccess('Account created successfully! Redirecting...');

        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }

    login(user) {
        console.log('🎉 Logging in:', user.name);

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.updateUI();
        this.showSuccess(`Welcome back, ${user.name}!`);

        if (typeof playSound === 'function') {
            playSound();
        }
    }

    logout() {
        console.log('🚪 Logging out');

        this.currentUser = null;
        localStorage.removeItem('currentUser');

        this.updateUI();
        this.showSuccess('Logged out successfully!');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    validatePasswordRealTime() {
        const password = $('#signup-password').val();

        if (password.length === 0) {
            $('#password-strength-container').hide();
            return;
        }

        $('#password-strength-container').show();

        const strength = this.checkPasswordStrength(password);
        const width = (strength + 1) * 20;
        const color = this.getStrengthColor(strength);
        const text = this.getStrengthText(strength);

        $('#password-strength').css({
            'width': width + '%',
            'background-color': color
        });

        $('#password-strength-text').text(text).css('color', color);
    }

    validatePasswordMatch() {
        const password = $('#signup-password').val();
        const confirm = $('#signup-confirm').val();

        if (confirm.length === 0) {
            $('#signup-confirm-error').hide();
            return;
        }

        if (password !== confirm) {
            $('#signup-confirm-error').text('Passwords do not match').show();
        } else {
            $('#signup-confirm-error').hide();
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePassword(password) {
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password);
    }

    checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

    getStrengthColor(strength) {
        const colors = ['#dc3545', '#ff6b6b', '#ffc107', '#20c997', '#28a745', '#198754'];
        return colors[strength] || '#dc3545';
    }

    getStrengthText(strength) {
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        return texts[strength] || 'Very Weak';
    }

    updateUI() {
        // Update navigation
        if ($('#auth-text').length) {
            $('#auth-text').text(this.currentUser ? this.currentUser.name : 'Login');
        }

        if ($('#auth-link').length) {
            $('#auth-link').attr('href', this.currentUser ? 'profile.html' : 'auth.html');
        }

        // Update profile page
        if (this.currentUser && $('#profile-name').length) {
            $('#profile-name').text(this.currentUser.name);
            $('#profile-email').text(this.currentUser.email);
            $('#profile-avatar').text(this.currentUser.name.charAt(0).toUpperCase());

            const joinDate = new Date(this.currentUser.joinDate);
            $('#member-since').text(`Member since ${joinDate.toLocaleDateString()}`);

            $('#profile-container').show();
            $('#auth-forms').hide();
        }
    }

    showError(fieldId, message) {
        $(`#${fieldId}`).addClass('is-invalid');
        $(`#${fieldId}-error`).text(message).show();
    }

    showSuccess(message) {
        // On auth page
        if ($('#success-message').length) {
            $('#success-message').text(message).show();
            setTimeout(() => $('#success-message').hide(), 5000);
        }

        // On other pages
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
    }

    clearErrors() {
        $('.error-message').hide();
        $('.form-control').removeClass('is-invalid');
    }

    saveUsers() {
        localStorage.setItem('soulslike_users', JSON.stringify(this.users));
        console.log('💾 Users saved:', this.users);
    }

    // Rating methods
    saveGameRating(gameId, gameName, rating, image = '', genre = '') {
        if (!this.currentUser) {
            this.showError('', 'Please log in to rate games');
            return false;
        }

        if (!this.currentUser.ratings) this.currentUser.ratings = {};
        if (!this.currentUser.ratedGames) this.currentUser.ratedGames = [];

        this.currentUser.ratings[gameId] = rating;

        const existingIndex = this.currentUser.ratedGames.findIndex(g => g.id === gameId);
        if (existingIndex === -1) {
            this.currentUser.ratedGames.push({
                id: gameId,
                name: gameName,
                rating: rating,
                image: image,
                genre: genre,
                ratedAt: new Date().toISOString()
            });
        } else {
            this.currentUser.ratedGames[existingIndex].rating = rating;
        }

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.currentUser };
            this.saveUsers();
        }

        return true;
    }

    getGameRating(gameId) {
        return this.currentUser?.ratings?.[gameId] || 0;
    }

    getRatedGames() {
        return this.currentUser?.ratedGames || [];
    }

    removeGameRating(gameId) {
    if (!this.currentUser || !this.currentUser.ratedGames) return;

    // Remove game from ratedGames array
    this.currentUser.ratedGames = this.currentUser.ratedGames.filter(g => g.id !== gameId);

    // Remove rating from ratings object if exists
    if (this.currentUser.ratings && this.currentUser.ratings[gameId]) {
        delete this.currentUser.ratings[gameId];
    }

    // Save updated user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    // Update user in soulslike_users array
    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        this.saveUsers();
    }
    }

}

// Global functions
function showLogin() {
    $('#login-form').show();
    $('#signup-form').hide();
    $('.error-message').hide();
    $('.form-control').removeClass('is-invalid');
}
// auth.js - Fixed with immediate function
(function() {
    if (typeof window.AuthSystem !== 'undefined') {
        return; // Already defined, skip
    }

    class AuthSystem {
        constructor() {
            this.users = JSON.parse(localStorage.getItem('soulslike_users')) || [];
            this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
            this.init();
        }

        init() {
            console.log('🔐 Auth System Initialized');
            this.updateUI();
            this.setupEventListeners();
        }

        setupEventListeners() {
            // Login form
            $(document).on('submit', '#loginForm', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            // Signup form
            $(document).on('submit', '#signupForm', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        handleLogin() {
            const email = $('#login-email').val().trim();
            const password = $('#login-password').val().trim();

            this.clearErrors();

            if (!email) {
                this.showError('login-email', 'Email is required');
                return;
            }

            if (!password) {
                this.showError('login-password', 'Password is required');
                return;
            }

            const user = this.users.find(u => u.email === email && u.password === password);

            if (user) {
                this.login(user);
                if (typeof showNotification === 'function') {
                    showNotification(`Welcome back, ${user.name}!`, 'success');
                }
            } else {
                this.showError('login-password', 'Invalid email or password');
            }
        }

        handleSignup() {
            const name = $('#signup-name').val().trim();
            const email = $('#signup-email').val().trim();
            const password = $('#signup-password').val();
            const confirmPassword = $('#signup-confirm').val();

            this.clearErrors();

            // Validation
            if (!name || name.length < 2) {
                this.showError('signup-name', 'Name must be at least 2 characters');
                return;
            }

            if (!this.validateEmail(email)) {
                this.showError('signup-email', 'Please enter a valid email');
                return;
            }

            if (this.users.find(u => u.email === email)) {
                this.showError('signup-email', 'Email already registered');
                return;
            }

            if (password.length < 6) {
                this.showError('signup-password', 'Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                this.showError('signup-confirm', 'Passwords do not match');
                return;
            }

            // Create user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password,
                joinDate: new Date().toISOString(),
                ratings: {}
            };

            this.users.push(newUser);
            localStorage.setItem('soulslike_users', JSON.stringify(this.users));

            this.login(newUser);
            if (typeof showNotification === 'function') {
                showNotification('Account created successfully!', 'success');
            }
        }

        login(user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));

            this.updateUI();

            // Redirect to home after login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }

        logout() {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            this.updateUI();
            if (typeof showNotification === 'function') {
                showNotification('Logged out successfully!', 'info');
            }

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }

        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        updateUI() {
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

        showError(fieldId, message) {
            $(`#${fieldId}`).addClass('is-invalid');
            $(`#${fieldId}-error`).text(message).show();
        }

        clearErrors() {
            $('.error-message').hide();
            $('.form-control').removeClass('is-invalid');
        }

        // Rating system
        saveGameRating(gameId, gameName, rating, image = '') {
            if (!this.currentUser) {
                if (typeof showNotification === 'function') {
                    showNotification('Please log in to rate games', 'error');
                }
                return false;
            }

            if (!this.currentUser.ratings) {
                this.currentUser.ratings = {};
            }

            this.currentUser.ratings[gameId] = {
                rating: rating,
                gameName: gameName,
                image: image,
                ratedAt: new Date().toISOString()
            };

            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            return true;
        }

        getGameRating(gameId) {
            return this.currentUser?.ratings?.[gameId]?.rating || 0;
        }

        getRatedGames() {
            if (!this.currentUser?.ratings) return [];
            return Object.values(this.currentUser.ratings);
        }
    }

    // Define global functions
    window.showLogin = function() {
        $('#login-form').show();
        $('#signup-form').hide();
        $('.error-message').hide();
    }

    window.showSignup = function() {
        $('#login-form').hide();
        $('#signup-form').show();
        $('.error-message').hide();
    }

    window.logout = function() {
        if (window.authSystem) {
            window.authSystem.logout();
        }
    }

    // Initialize
    $(document).ready(function() {
        if (typeof window.authSystem === 'undefined') {
            window.authSystem = new AuthSystem();
        }
    });

    // Define the class globally
    window.AuthSystem = AuthSystem;
})();
function showSignup() {
    $('#login-form').hide();
    $('#signup-form').show();
    $('.error-message').hide();
    $('.form-control').removeClass('is-invalid');
    $('#password-strength-container').hide();
}

function logout() {
    if (window.authSystem) {
        window.authSystem.logout();
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = field.parentNode.querySelector('.password-toggle-icon');

    if (field.type === 'password') {
        field.type = 'text';
        icon.textContent = '🙈';
    } else {
        field.type = 'password';
        icon.textContent = '👁️';
    }
}

// Initialize
$(document).ready(function() {
    window.authSystem = new AuthSystem();

    // Add password strength HTML
    if ($('#signup-password').length && !$('#password-strength-container').length) {
        $('#signup-password').after(`
            <div id="password-strength-container" class="password-strength-container mt-2" style="display: none;">
                <div class="d-flex justify-content-between mb-1">
                    <small>Password Strength:</small>
                    <small id="password-strength-text" class="fw-bold"></small>
                </div>
                <div class="progress" style="height: 6px;">
                    <div id="password-strength" class="progress-bar" style="width: 0%; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `);
    }
});

