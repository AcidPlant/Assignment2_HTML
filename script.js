// Task 5: Display Current Date and Time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const formattedDate = now.toLocaleDateString('en-US', options);
    const datetimeDisplay = document.getElementById('datetime-display');

    if (datetimeDisplay) {
        datetimeDisplay.innerHTML = `
            <div class="alert alert-dark text-center">
                <div class="fw-bold text-danger">📅 Current Date & Time</div>
                <div class="mt-2">${formattedDate}</div>
            </div>
        `;
    }
}

// Update datetime every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// ===== ADVANCED JAVASCRIPT FEATURES =====

// ===== DOM MANIPULATION AND STYLING =====

// 1. Rating System
function initRatingSystem() {
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('rating-display');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            updateStars(rating);
            ratingDisplay.textContent = `Your rating: ${rating}/5`;
            ratingDisplay.className = 'mb-0 text-success';
            playSound();
        });

        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStars(rating, true);
        });

        star.addEventListener('mouseout', function() {
            updateStars(currentRating);
        });
    });

    function updateStars(rating, isHover = false) {
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
}

// 2. Theme Management
function initThemeSystem() {
    const dayThemeBtn = document.getElementById('day-theme');
    const nightThemeBtn = document.getElementById('night-theme');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const randomColorBtn = document.getElementById('random-color');

    const themes = {
        day: {
            background: '#f8f9fa',
            text: '#212529',
            card: '#ffffff',
            accent: '#dc3545'
        },
        night: {
            background: '#0a0a0a',
            text: '#e0e0e0',
            card: '#1a1a1a',
            accent: '#dc3545'
        }
    };

    function applyTheme(theme) {
        document.body.style.backgroundColor = theme.background;
        document.body.style.color = theme.text;

        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = theme.card;
            card.style.color = theme.text;
        });

        document.querySelectorAll('.bg-dark').forEach(el => {
            el.style.backgroundColor = theme.card;
        });

        document.querySelectorAll('.bg-secondary').forEach(el => {
            el.style.backgroundColor = theme === themes.day ? '#e9ecef' : '#2a2a2a';
        });

        // Update button states
        if (dayThemeBtn && nightThemeBtn) {
            if (theme === themes.day) {
                dayThemeBtn.classList.add('active');
                nightThemeBtn.classList.remove('active');
            } else {
                nightThemeBtn.classList.add('active');
                dayThemeBtn.classList.remove('active');
            }
        }
    }

    dayThemeBtn?.addEventListener('click', () => {
        applyTheme(themes.day);
        localStorage.setItem('theme', 'day');
        playSound();
    });

    nightThemeBtn?.addEventListener('click', () => {
        applyTheme(themes.night);
        localStorage.setItem('theme', 'night');
        playSound();
    });

    themeToggleBtn?.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'night';
        const newTheme = currentTheme === 'night' ? 'day' : 'night';
        applyTheme(themes[newTheme]);
        localStorage.setItem('theme', newTheme);
        playSound();
    });

    randomColorBtn?.addEventListener('click', () => {
        const colors = ['#1a0f1f', '#0f1a1a', '#1a1a0f', '#1f0f0f', '#0f0f1f'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor;
        document.body.style.transition = 'background-color 0.5s ease';
        playSound();
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'night';
    applyTheme(themes[savedTheme]);
}

// ===== EVENT HANDLING =====

// 1. Button Event Listeners
function initButtonEvents() {
    const timeBtn = document.getElementById('time-btn');
    const soundBtn = document.getElementById('sound-btn');
    const animateBtn = document.getElementById('animate-btn');
    const greetBtn = document.getElementById('greet-btn');
    const loadContentBtn = document.getElementById('load-content');

    // Current Time Display
    timeBtn?.addEventListener('click', function() {
        const timeDisplay = document.getElementById('time-display');
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        timeDisplay.innerHTML = `
            <div class="alert alert-info">
                <h4>🕒 Current Time</h4>
                <p class="mb-0 fs-4">${timeString}</p>
            </div>
        `;

        animateElement(timeDisplay);
        playSound();
    });

    // Sound Effect
    soundBtn?.addEventListener('click', function() {
        playSound();
        this.textContent = '🔊 Playing...';
        this.classList.add('btn-success');
        setTimeout(() => {
            this.textContent = '🔊 Play Sound';
            this.classList.remove('btn-success');
        }, 1000);
    });

    // Animation Trigger
    animateBtn?.addEventListener('click', function() {
        animateCards();
        playSound();
    });

    // Greeting System
    greetBtn?.addEventListener('click', function() {
        const nameInput = document.getElementById('name-input');
        const greetingDisplay = document.getElementById('greeting-display');
        const name = nameInput.value.trim();

        if (name) {
            const hour = new Date().getHours();
            let greeting;

            // Switch statement for different greetings based on time
            switch(true) {
                case hour < 12:
                    greeting = `Good morning, ${name}! Ready for some souls-like action?`;
                    break;
                case hour < 18:
                    greeting = `Good afternoon, ${name}! Time to conquer some bosses!`;
                    break;
                default:
                    greeting = `Good evening, ${name}! Perfect time for dark adventures!`;
            }

            greetingDisplay.textContent = greeting;
            greetingDisplay.className = 'text-center text-success fade-in';

            setTimeout(() => {
                greetingDisplay.className = 'text-center';
            }, 3000);

            playSound();
        } else {
            greetingDisplay.textContent = 'Please enter your name first!';
            greetingDisplay.className = 'text-center text-danger';
        }
    });

    // Dynamic Content Loading
    loadContentBtn?.addEventListener('click', function() {
        loadRandomContent();
        playSound();
    });
}

// 2. Keyboard Navigation
function initKeyboardNavigation() {
    let currentFocus = 0;
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');

    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                currentFocus = (currentFocus + 1) % focusableElements.length;
                focusableElements[currentFocus].focus();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                currentFocus = (currentFocus - 1 + focusableElements.length) % focusableElements.length;
                focusableElements[currentFocus].focus();
                break;
            case 'Enter':
                if (e.target === document.getElementById('name-input')) {
                    document.getElementById('greet-btn').click();
                }
                break;
        }
    });
}

// ===== ADVANCED JAVASCRIPT CONCEPTS =====

// 1. Objects and Methods
const gameManager = {
    games: [
        { name: 'Dark Souls III', difficulty: 'Hard', genre: 'Action RPG' },
        { name: 'Hollow Knight', difficulty: 'Medium', genre: 'Metroidvania' },
        { name: 'Elden Ring', difficulty: 'Hard', genre: 'Open World' },
        { name: 'Sekiro', difficulty: 'Very Hard', genre: 'Action' }
    ],

    getGamesByDifficulty(difficulty) {
        return this.games.filter(game => game.difficulty === difficulty);
    },

    getRandomGame() {
        return this.games[Math.floor(Math.random() * this.games.length)];
    },

    displayGames() {
        console.log('Available Souls-like Games:');
        this.games.forEach((game, index) => {
            console.log(`${index + 1}. ${game.name} - ${game.difficulty} - ${game.genre}`);
        });
    }
};

// 2. Arrays and Higher-Order Functions
function loadRandomContent() {
    const facts = [
        "Dark Souls was inspired by the manga Berserk and classical European architecture.",
        "Hollow Knight was developed by just 3 people at Team Cherry.",
        "Elden Ring sold over 20 million copies in its first year.",
        "Sekiro: Shadows Die Twice won Game of the Year in 2019.",
        "The term 'Souls-like' was coined by the gaming community to describe games with similar mechanics to Dark Souls.",
        "Bloodborne's combat system encourages aggressive play with its rally mechanic.",
        "The average player dies over 100 times in their first Dark Souls playthrough.",
        "Nioh combines Souls-like combat with Diablo-style loot systems."
    ];

    const contentArea = document.getElementById('content-area');
    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    // Using array higher-order functions
    const formattedFacts = facts
        .filter(fact => fact.length > 30) // Only facts longer than 30 chars
        .map(fact => ({
            text: fact,
            length: fact.length,
            words: fact.split(' ').length
        }));

    const selectedFact = formattedFacts[Math.floor(Math.random() * formattedFacts.length)];

    contentArea.innerHTML = `
        <div class="alert alert-dark">
            <h5>🎮 Souls-like Fact</h5>
            <p class="mb-2">${selectedFact.text}</p>
            <small class="text-muted">Length: ${selectedFact.length} chars, ${selectedFact.words} words</small>
        </div>
    `;

    animateElement(contentArea);
}

// 3. Sound Effects
function playSound() {
    const sound = document.getElementById('sound-effect');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }
}

// 4. Animations
function animateCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        card.style.transform = 'scale(0.9)';
        card.style.opacity = '0.5';

        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'scale(1.05) rotateY(10deg)';
            card.style.opacity = '1';
            card.style.boxShadow = '0 15px 35px rgba(220, 53, 69, 0.4)';

            setTimeout(() => {
                card.style.transform = 'scale(1) rotateY(0)';
                card.style.boxShadow = '';
            }, 600);
        }, index * 100);
    });
}

function animateElement(element) {
    if (!element) return;

    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';

    setTimeout(() => {
        element.style.transition = 'all 0.5s ease';
        element.style.transform = 'scale(1)';
        element.style.opacity = '1';
    }, 50);
}

// ===== MULTI-STEP FORM =====
function initMultiStepForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 3;

    function showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(el => {
            el.style.display = 'none';
        });

        // Show current step
        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
        }

        // Update progress
        updateProgress(step);
    }

    function updateProgress(step) {
        const progress = document.getElementById('form-progress');
        if (progress) {
            const percentage = ((step - 1) / (totalSteps - 1)) * 100;
            progress.style.width = `${percentage}%`;
        }
    }

    function validateStep(step) {
        let isValid = true;

        switch(step) {
            case 1:
                const name = document.getElementById('name');
                const email = document.getElementById('email');

                if (!name.value.trim() || name.value.trim().length < 2) {
                    showError('name', 'Name is required and must be at least 2 characters');
                    isValid = false;
                } else {
                    showSuccess('name');
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email.value.trim() || !emailRegex.test(email.value)) {
                    showError('email', 'Please enter a valid email address');
                    isValid = false;
                } else {
                    showSuccess('email');
                }
                break;

            case 2:
                const subject = document.getElementById('subject');
                const message = document.getElementById('message');

                if (!subject.value) {
                    showError('subject', 'Please select a subject');
                    isValid = false;
                } else {
                    showSuccess('subject');
                }

                if (!message.value.trim() || message.value.trim().length < 10) {
                    showError('message', 'Message must be at least 10 characters');
                    isValid = false;
                } else {
                    showSuccess('message');
                }
                break;
        }

        return isValid;
    }

    function updateReview() {
        document.getElementById('review-name').textContent = document.getElementById('name').value;
        document.getElementById('review-email').textContent = document.getElementById('email').value;
        document.getElementById('review-subject').textContent = document.getElementById('subject').options[document.getElementById('subject').selectedIndex].text;
        document.getElementById('review-message').textContent = document.getElementById('message').value;
    }

    // Navigation buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep) && currentStep < totalSteps) {
                currentStep++;
                if (currentStep === totalSteps) {
                    updateReview();
                }
                showStep(currentStep);
                playSound();
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                playSound();
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
            currentStep = 1;
            showStep(currentStep);
            playSound();
        }
    });

    // Initialize first step
    showStep(1);
}

// ===== GAME FILTERING SYSTEM =====
function initGameFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gameCards = document.querySelectorAll('.game-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Filter games
            gameCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });

            playSound();
        });
    });
}

// ===== LANGUAGE SELECTOR =====
function initLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;

    const translations = {
        en: {
            welcome: "SOULS-LIKE GAMES",
            about: "About",
            contact: "Contact",
            library: "Library"
        },
        kk: {
            welcome: "SOULS-LIKE ОЙЫНДАРЫ",
            about: "Біз туралы",
            contact: "Байланыс",
            library: "Кітапхана"
        },
        ru: {
            welcome: "SOULS-LIKE ИГРЫ",
            about: "О нас",
            contact: "Контакты",
            library: "Библиотека"
        }
    };

    languageSelect.addEventListener('change', function() {
        const lang = this.value;
        const translation = translations[lang];

        // Update page content based on selected language
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });

        // Update navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            const text = link.textContent.trim();
            if (translation[text.toLowerCase()]) {
                link.textContent = translation[text.toLowerCase()];
            }
        });

        localStorage.setItem('preferred-language', lang);
        playSound();
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    languageSelect.value = savedLang;
    languageSelect.dispatchEvent(new Event('change'));
}

// ===== TASK 1: FORM VALIDATION =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm && !contactForm.classList.contains('multi-step')) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Reset previous errors
            resetErrors();

            let isValid = true;

            // Validate Name
            const name = document.getElementById('name');
            if (!name.value.trim() || name.value.trim().length < 2) {
                showError('name', 'Name is required and must be at least 2 characters');
                isValid = false;
            } else {
                showSuccess('name');
            }

            // Validate Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                showSuccess('email');
            }

            // Validate Password
            const password = document.getElementById('password');
            if (password && (!password.value || password.value.length < 8)) {
                showError('password', 'Password must be at least 8 characters');
                isValid = false;
            } else if (password) {
                showSuccess('password');
            }

            // Validate Password Confirmation
            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword && (!confirmPassword.value || confirmPassword.value !== password.value)) {
                showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            } else if (confirmPassword) {
                showSuccess('confirmPassword');
            }

            // Validate Subject
            const subject = document.getElementById('subject');
            if (subject && !subject.value) {
                showError('subject', 'Please select a subject');
                isValid = false;
            } else if (subject) {
                showSuccess('subject');
            }

            // Validate Message
            const message = document.getElementById('message');
            if (message && (!message.value.trim() || message.value.trim().length < 10)) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            } else if (message) {
                showSuccess('message');
            }

            // If form is valid, show success message
            if (isValid) {
                alert('Form submitted successfully! Thank you for contacting us.');
                contactForm.reset();
                resetErrors();
                playSound();
            }
        });
    }
});

function showError(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');

    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }

    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    }
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');

    if (field) {
        field.classList.add('success');
        field.classList.remove('error');
    }

    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function resetErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const formControls = document.querySelectorAll('.form-control, .form-select');

    errorMessages.forEach(error => {
        error.style.display = 'none';
    });

    formControls.forEach(control => {
        control.classList.remove('error', 'success');
    });
}

// ===== TASK 3: POPUP SUBSCRIPTION FORM =====
const subscribeBtn = document.getElementById('subscribe-btn');
const popupOverlay = document.getElementById('popup-overlay');
const popupForm = document.getElementById('popup-form');
const popupClose = document.getElementById('popup-close');
const subscriptionForm = document.getElementById('subscription-form');

if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function() {
        showPopup();
        playSound();
    });
}

if (popupClose) {
    popupClose.addEventListener('click', function() {
        hidePopup();
        playSound();
    });
}

if (popupOverlay) {
    popupOverlay.addEventListener('click', function() {
        hidePopup();
    });
}

if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const subName = document.getElementById('sub-name').value;
        const subEmail = document.getElementById('sub-email').value;

        if (subName && subEmail) {
            alert(`Thank you for subscribing, ${subName}! We'll send updates to ${subEmail}.`);
            subscriptionForm.reset();
            hidePopup();
            playSound();
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

function showPopup() {
    if (popupOverlay) popupOverlay.classList.add('show');
    if (popupForm) popupForm.classList.add('show');
}

function hidePopup() {
    if (popupOverlay) popupOverlay.classList.remove('show');
    if (popupForm) popupForm.classList.remove('show');
}

// ===== TASK 4: CHANGE BACKGROUND COLOR =====
const colorChangeBtn = document.getElementById('color-change-btn');
const colors = [
    '#0a0a0a', // Original dark
    '#1a0f1f', // Dark purple
    '#0f1a1a', // Dark teal
    '#1a1a0f', // Dark olive
    '#1f0f0f', // Dark red
    '#0f0f1f', // Dark blue
    '#1a0a14', // Dark brown
    '#141a0a', // Dark green',
];

let currentColorIndex = 0;

if (colorChangeBtn) {
    colorChangeBtn.addEventListener('click', function() {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        document.body.style.transition = 'background-color 0.5s ease';
        document.body.style.backgroundColor = colors[currentColorIndex];

        // Add rotation animation to button
        this.style.transform = 'scale(1.1) rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);

        playSound();
    });
}

// ===== TASK 2: ACCORDION FOR FAQS =====
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all accordion items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0';
                        otherContent.style.padding = '0 1rem';
                    }
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.padding = '1rem';
                    playSound();
                }
            });
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all systems
    initRatingSystem();
    initThemeSystem();
    initButtonEvents();
    initKeyboardNavigation();
    initMultiStepForm();
    initGameFiltering();
    initLanguageSelector();
    initAccordion();

    // Display game manager data
    gameManager.displayGames();

    console.log('🚀 Advanced JavaScript features loaded successfully!');

    // Add some interactive elements to existing cards
    enhanceExistingCards();
});

function enhanceExistingCards() {
    // Add hover effects to all cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Utility function for smooth scrolling
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for global access (if needed)
window.soulsLikeApp = {
    smoothScrollTo,
    playSound,
    animateCards,
    loadRandomContent
};