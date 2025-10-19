// In-memory storage instead of localStorage
const appState = {
    theme: 'night',
    language: 'en',
    currentRating: 0
};

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

// ===== DOM MANIPULATION AND STYLING =====

// 1. Rating System
function initRatingSystem() {
    const stars = document.querySelectorAll('.star');
    const ratingDisplay = document.getElementById('rating-display');

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            appState.currentRating = rating;
            updateStars(rating);
            if (ratingDisplay) {
                ratingDisplay.textContent = `Your rating: ${rating}/5`;
                ratingDisplay.className = 'mb-0 text-success';
            }
            playSound();
        });

        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            updateStars(rating, true);
        });

        star.addEventListener('mouseout', function() {
            updateStars(appState.currentRating);
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

        // Update button states
        if (dayThemeBtn && nightThemeBtn) {
            if (theme === themes.day) {
                dayThemeBtn.classList.add('active');
                nightThemeBtn.classList.remove('active');
                appState.theme = 'day';
            } else {
                nightThemeBtn.classList.add('active');
                dayThemeBtn.classList.remove('active');
                appState.theme = 'night';
            }
        }
    }

    dayThemeBtn?.addEventListener('click', () => {
        applyTheme(themes.day);
        playSound();
    });

    nightThemeBtn?.addEventListener('click', () => {
        applyTheme(themes.night);
        playSound();
    });

    themeToggleBtn?.addEventListener('click', () => {
        const newTheme = appState.theme === 'night' ? 'day' : 'night';
        applyTheme(themes[newTheme]);
        playSound();
    });

    randomColorBtn?.addEventListener('click', () => {
        const colors = ['#1a0f1f', '#0f1a1a', '#1a1a0f', '#1f0f0f', '#0f0f1f'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        document.body.style.backgroundColor = randomColor;
        document.body.style.transition = 'background-color 0.5s ease';
        playSound();
    });

    // Apply default theme
    applyTheme(themes[appState.theme]);
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

        if (timeDisplay) {
            timeDisplay.innerHTML = `
                <div class="alert alert-info">
                    <h4>🕐 Current Time</h4>
                    <p class="mb-0 fs-4">${timeString}</p>
                </div>
            `;
            animateElement(timeDisplay);
        }
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
        const name = nameInput?.value.trim();

        if (name && greetingDisplay) {
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
        } else if (greetingDisplay) {
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
                focusableElements[currentFocus]?.focus();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                currentFocus = (currentFocus - 1 + focusableElements.length) % focusableElements.length;
                focusableElements[currentFocus]?.focus();
                break;
            case 'Enter':
                if (e.target === document.getElementById('name-input')) {
                    document.getElementById('greet-btn')?.click();
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
    if (!contentArea) return;

    // Using array higher-order functions
    const formattedFacts = facts
        .filter(fact => fact.length > 30)
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
        document.querySelectorAll('.form-step').forEach(el => {
            el.style.display = 'none';
            el.classList.remove('active');
        });

        const currentStepEl = document.getElementById(`step-${step}`);
        if (currentStepEl) {
            currentStepEl.style.display = 'block';
            currentStepEl.classList.add('active');
        }

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

                if (name) {
                    if (!name.value.trim() || name.value.trim().length < 2) {
                        showError('name', 'Name is required and must be at least 2 characters');
                        isValid = false;
                    } else {
                        showSuccess('name');
                    }
                }

                if (email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!email.value.trim() || !emailRegex.test(email.value)) {
                        showError('email', 'Please enter a valid email address');
                        isValid = false;
                    } else {
                        showSuccess('email');
                    }
                }
                break;

            case 2:
                const subject = document.getElementById('subject');
                const message = document.getElementById('message');

                if (subject) {
                    if (!subject.value) {
                        showError('subject', 'Please select a subject');
                        isValid = false;
                    } else {
                        showSuccess('subject');
                    }
                }

                if (message) {
                    if (!message.value.trim() || message.value.trim().length < 10) {
                        showError('message', 'Message must be at least 10 characters');
                        isValid = false;
                    } else {
                        showSuccess('message');
                    }
                }
                break;
        }

        return isValid;
    }

    function updateReview() {
        const reviewName = document.getElementById('review-name');
        const reviewEmail = document.getElementById('review-email');
        const reviewSubject = document.getElementById('review-subject');
        const reviewMessage = document.getElementById('review-message');
        const subject = document.getElementById('subject');

        if (reviewName) reviewName.textContent = document.getElementById('name')?.value || '';
        if (reviewEmail) reviewEmail.textContent = document.getElementById('email')?.value || '';
        if (reviewSubject && subject) {
            reviewSubject.textContent = subject.options[subject.selectedIndex]?.text || '';
        }
        if (reviewMessage) reviewMessage.textContent = document.getElementById('message')?.value || '';
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

            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            gameCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
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
            // Hero section
            welcome: "SOULS-LIKE GAMES",
            heroSubtitle: "Discover the world of hardcore games. Find any souls-like game in our extensive library",
            
            // Navigation
            home: "Home",
            library: "Library",
            about: "About",
            contact: "Contact",
            
            // Sections
            whatAreSoulsLike: "What are Souls-like games?",
            popularGames: "Popular Souls-like Games",
            categories: "Categories of Souls-like Games",
            
            // Buttons
            learnMore: "Learn More",
            viewMore: "View More",
            browseLibrary: "Browse Our Library"
        },
        kk: {
            // Hero section
            welcome: "SOULS-LIKE ОЙЫНДАРЫ",
            heroSubtitle: "Хардкор ойындар әлеміне саяхат жасаңыз. Біздің кең кітапханадан кез келген souls-like ойынын табыңыз",
            
            // Navigation
            home: "Басты бет",
            library: "Кітапхана",
            about: "Біз туралы",
            contact: "Байланыс",
            
            // Sections
            whatAreSoulsLike: "Souls-like ойындары дегеніміз не?",
            popularGames: "Танымал Souls-like Ойындары",
            categories: "Souls-like Ойындарының Санаттары",
            
            // Buttons
            learnMore: "Толығырақ",
            viewMore: "Көбірек көру",
            browseLibrary: "Кітапхананы шолу"
        },
        ru: {
            // Hero section
            welcome: "SOULS-LIKE ИГРЫ",
            heroSubtitle: "Откройте для себя мир хардкорных игр. Найдите любую souls-like игру в нашей обширной библиотеке",
            
            // Navigation
            home: "Главная",
            library: "Библиотека",
            about: "О нас",
            contact: "Контакты",
            
            // Sections
            whatAreSoulsLike: "Что такое Souls-like игры?",
            popularGames: "Популярные Souls-like Игры",
            categories: "Категории Souls-like Игр",
            
            // Buttons
            learnMore: "Узнать больше",
            viewMore: "Смотреть больше",
            browseLibrary: "Просмотр библиотеки"
        }
    };

    function applyTranslation(lang) {
        const translation = translations[lang];
        if (!translation) return;

        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });

        // Translate navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === 'index.html' && translation.home) {
                link.textContent = translation.home;
            } else if (href === 'library.html' && translation.library) {
                link.textContent = translation.library;
            } else if (href === 'about.html' && translation.about) {
                link.textContent = translation.about;
            } else if (href === 'contact.html' && translation.contact) {
                link.textContent = translation.contact;
            }
        });

        appState.language = lang;
    }

    languageSelect.addEventListener('change', function() {
        applyTranslation(this.value);
        playSound();
    });

    // Apply initial language
    applyTranslation(appState.language);
}

// ===== FORM VALIDATION =====
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

// ===== POPUP SUBSCRIPTION FORM =====
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

        const subName = document.getElementById('sub-name')?.value;
        const subEmail = document.getElementById('sub-email')?.value;

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

// ===== CHANGE BACKGROUND COLOR =====
const colorChangeBtn = document.getElementById('color-change-btn');
const colors = [
    '#0a0a0a',
    '#1a0f1f',
    '#0f1a1a',
    '#1a1a0f',
    '#1f0f0f',
    '#0f0f1f',
    '#1a0a14',
    '#141a0a'
];

let currentColorIndex = 0;

if (colorChangeBtn) {
    colorChangeBtn.addEventListener('click', function() {
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        document.body.style.transition = 'background-color 0.5s ease';
        document.body.style.backgroundColor = colors[currentColorIndex];

        this.style.transform = 'scale(1.1) rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);

        playSound();
    });
}

// ===== ACCORDION FOR FAQS =====
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0';
                        otherContent.style.padding = '0 1rem';
                    }
                });

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
    initRatingSystem();
    initThemeSystem();
    initButtonEvents();
    initKeyboardNavigation();
    initMultiStepForm();
    initGameFiltering();
    initLanguageSelector();
    initAccordion();

    gameManager.displayGames();
    enhanceExistingCards();

    console.log('🚀 Advanced JavaScript features loaded successfully!');
});

function enhanceExistingCards() {
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

function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

window.soulsLikeApp = {
    smoothScrollTo,
    playSound,
    animateCards,
    loadRandomContent
};