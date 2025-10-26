// ===== JQUERY SETUP =====
$(document).ready(function() {
    console.log("jQuery is ready!");

    // Initialize all systems
    initDateTime();
    initWelcomeAlert();
    initRatingSystem();
    initThemeSystem();
    initButtonEvents();
    initKeyboardNavigation();
    initMultiStepForm();
    initGameFiltering();
    initLanguageSelector();
    initAccordion();
    initCardRatings();
    startFactRotation();
    enhanceExistingCards();

    // jQuery Assignment 7 Tasks
    initRealtimeSearch();
    initAutocompleteSearch();
    initSearchHighlighting();
    initScrollProgressBar();
    initAnimatedCounter();
    initLoadingSpinner();
    initNotificationSystem();
    initCopyToClipboard();
    initLazyLoading();

    gameManager.displayGames();
    console.log('🚀 Advanced JavaScript and jQuery features loaded successfully!');
});

// ===== PART 1: JQUERY SEARCH =====

// Task 1: Real-time Search and Live Filter
function initRealtimeSearch() {
    const searchInput = $('#searchInput');
    const gameCards = $('.game-card');

    if (searchInput.length && gameCards.length) {
        // Real-time search on typing
        searchInput.on('keyup', function() {
            performSearch();
        });

        // Category filter change
        $('#categoryFilter').on('change', function() {
            performSearch();
        });

        // Search button click
        $('#searchButton').on('click', function() {
            performSearch();
        });

        // Enter key support
        searchInput.on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                performSearch();
            }
        });

        function performSearch() {
            const searchTerm = searchInput.val().toLowerCase().trim();
            const categoryFilter = $('#categoryFilter').val();

            let visibleCount = 0;
            let hasActiveFilters = searchTerm !== '' || categoryFilter !== '';

            gameCards.each(function() {
                const $card = $(this);
                const cardTitle = $card.find('.card-title').text().toLowerCase();
                const cardText = $card.find('.card-text').text().toLowerCase();
                const cardCategory = $card.data('category');

                const matchesSearch = searchTerm === '' ||
                    cardTitle.includes(searchTerm) ||
                    cardText.includes(searchTerm);
                const matchesCategory = categoryFilter === '' || cardCategory === categoryFilter;

                if (matchesSearch && matchesCategory) {
                    $card.stop(true, true).fadeIn(300).css({
                        'display': 'block',
                        'opacity': '1'
                    });
                    visibleCount++;
                } else {
                    $card.stop(true, true).fadeOut(300).css('display', 'none');
                }
            });

            // Show/hide no results message
            if (visibleCount === 0 && hasActiveFilters) {
                if ($('#no-results').length === 0) {
                    $('.row.g-4').after(
                        '<div id="no-results" class="text-center text-muted py-5">' +
                        '<h3 class="text-danger">🎮 No games found</h3>' +
                        '<p>Try different keywords or categories</p>' +
                        '<button class="btn btn-sm btn-outline-danger mt-2" onclick="clearSearch()">Clear Search</button>' +
                        '</div>'
                    );
                }
            } else {
                $('#no-results').remove();
            }

            // Update results counter
            updateResultsCounter(visibleCount, gameCards.length, hasActiveFilters);
        }

        // Initialize search on page load
        performSearch();
    }
}

// Task 2: Autocomplete Search Suggestions
function initAutocompleteSearch() {
    const searchInput = $('#searchInput');

    if (searchInput.length) {
        const games = [
            'Dark Souls III', 'Hollow Knight', 'Code Vein', 'Blasphemous',
            'Sekiro: Shadows Die Twice', 'Elden Ring', 'Salt and Sanctuary',
            'Nioh 2', 'Dark Souls Remastered', 'Bloodborne', 'Mortal Shell', 'Lies of P'
        ];

        // Create autocomplete container if it doesn't exist
        if ($('#autocomplete-list').length === 0) {
            searchInput.closest('.position-relative').append('<div id="autocomplete-list" class="autocomplete-list"></div>');
        }

        const autocompleteList = $('#autocomplete-list');

        searchInput.on('input', function() {
            const value = $(this).val().toLowerCase();
            autocompleteList.empty().hide();

            if (value.length > 1) {
                const matches = games.filter(game =>
                    game.toLowerCase().includes(value)
                );

                if (matches.length > 0) {
                    matches.slice(0, 5).forEach(match => {
                        const item = $('<div class="autocomplete-item"></div>')
                            .html(`<i class="fas fa-gamepad me-2"></i> ${match}`)
                            .on('click', function() {
                                searchInput.val(match);
                                performSearch();
                                autocompleteList.empty().hide();
                            });
                        autocompleteList.append(item);
                    });
                    autocompleteList.show();
                }
            }
        });

        // Close autocomplete when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#searchInput, #autocomplete-list').length) {
                autocompleteList.hide();
            }
        });

        // Close autocomplete when pressing Enter
        searchInput.on('keydown', function(e) {
            if (e.key === 'Enter') {
                autocompleteList.hide();
            }
        });
    }
}

// Task 3: Search Highlighting
function initSearchHighlighting() {
    // Create and insert search box
    if ($('#faq-search-container').length === 0) {
        $('<div id="faq-search-container" class="mb-4">' +
            '<div class="input-group">' +
            '<input type="text" class="form-control bg-dark text-white border-danger" ' +
            'placeholder="🔍 Search in FAQ answers..." id="faq-search">' +
            '<button class="btn btn-outline-danger" type="button" id="clear-highlight">Clear</button>' +
            '</div>' +
            '<small class="text-muted mt-2 d-block">Type to highlight matching terms in FAQ answers</small>' +
            '</div>').insertBefore('#faq');
    }

    let originalContents = {};

    // Store original content on first run
    $('.accordion-content').each(function() {
        const id = $(this).attr('id') || 'content-' + Math.random();
        $(this).attr('data-content-id', id);
        if (!originalContents[id]) {
            originalContents[id] = $(this).html();
        }
    });

    $('#faq-search').on('input', function() {
        const searchTerm = $(this).val().trim();

        // Reset all content first
        $('.accordion-content').each(function() {
            const id = $(this).attr('data-content-id');
            $(this).html(originalContents[id]);
        });

        // Apply highlighting if search term exists
        if (searchTerm.length > 2) {
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');

            $('.accordion-content').each(function() {
                const currentHtml = $(this).html();
                const highlightedHtml = currentHtml.replace(regex, '<mark class="highlight">$1</mark>');
                $(this).html(highlightedHtml);
            });
        }
    });

    $('#clear-highlight').on('click', function() {
        $('#faq-search').val('');
        // Reset all content
        $('.accordion-content').each(function() {
            const id = $(this).attr('data-content-id');
            $(this).html(originalContents[id]);
        });
    });

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// ===== PART 2: UX ENGAGEMENT ELEMENTS =====

// Task 4: Colorful and Stylized Scroll Progress Bar
function initScrollProgressBar() {
    // Add progress bar to page
    if ($('#scroll-progress').length === 0) {
        $('body').prepend(`
            <div id="scroll-progress-container">
                <div id="scroll-progress"></div>
            </div>
        `);
    }

    $(window).on('scroll', function() {
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollTop = $(window).scrollTop();

        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

        $('#scroll-progress').css('width', progress + '%');
    });
}

// Task 5: Animated Number Counter
function initAnimatedCounter() {
    const counters = $('.stats-counter');

    if (counters.length === 0) {
        // Add stats section if not exists
        const statsSection = `
            <section class="stats-section py-5 bg-dark">
                <div class="container">
                    <div class="row g-4 text-center">
                        <div class="col-md-4">
                            <div class="stat-item">
                                <h2 class="text-danger stats-counter" data-target="12">0</h2>
                                <p class="text-muted">Games in Library</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-item">
                                <h2 class="text-danger stats-counter" data-target="50">0</h2>
                                <p class="text-muted">Boss Guides</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-item">
                                <h2 class="text-danger stats-counter" data-target="1000">0</h2>
                                <p class="text-muted">Community Members</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        $('.main-content').append(statsSection);
    }

    let animated = false;

    $(window).on('scroll', function() {
        const counters = $('.stats-counter');

        if (counters.length > 0 && !animated) {
            const statsSection = counters.closest('.stats-section');
            const sectionTop = statsSection.offset().top;
            const windowBottom = $(window).scrollTop() + $(window).height();

            if (windowBottom > sectionTop) {
                animated = true;

                counters.each(function() {
                    const $this = $(this);
                    const target = parseInt($this.data('target'));

                    $({ counter: 0 }).animate({ counter: target }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.floor(this.counter) + '+');
                        },
                        complete: function() {
                            $this.text(target + '+');
                        }
                    });
                });
            }
        }
    });
}

// Task 6: Loading Spinner on Submit
function initLoadingSpinner() {
    // Contact form submission
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();

        // Show loading state
        submitBtn.prop('disabled', true)
            .html('<span class="spinner-border spinner-border-sm me-2"></span>Submitting...');

        // Simulate server request
        setTimeout(() => {
            // Re-enable button
            submitBtn.prop('disabled', false).html(originalText);

            // Show success notification
            showNotification('Form submitted successfully! We will contact you soon.', 'success');

            // Optional: Reset form
            $(this)[0].reset();
            $('#step-1').show().siblings('.form-step').hide();
            $('#form-progress').css('width', '0%');

        }, 2000);
    });

    // Newsletter subscription form
    $('#subscription-form').on('submit', function(e) {
        e.preventDefault();

        const email = $('#sub-email').val();
        const name = $('#sub-name').val();

        if (email && name) {
            showNotification(`Thank you for subscribing, ${name}! Welcome to our community.`, 'success');
            $(this)[0].reset();
            hidePopup();
        } else {
            showNotification('Please fill in all required fields.', 'error');
        }
    });

    // Test notification button (for demonstration)
    if ($('#test-notification-btn').length === 0) {
        $('nav').after(`
            <div style="position: fixed; top: 100px; left: 20px; z-index: 9999;">
                <button id="test-notification-btn" class="btn btn-success btn-sm">
                    🔔 Test Notifications
                </button>
            </div>
        `);

        $('#test-notification-btn').on('click', function() {
            showNotification('Form submitted successfully!', 'success');
            setTimeout(() => showNotification('Error: Please check your input', 'error'), 1500);
            setTimeout(() => showNotification('New message received', 'info'), 3000);
        });
    }
}

// ===== PART 3: IMPROVE WEB APP FUNCTIONALITY =====

// Task 7: Notification System
function initNotificationSystem() {
    // Create notification container if it doesn't exist
    if ($('#notification-container').length === 0) {
        $('body').append(`
            <div id="notification-container" style="
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 99999;
                max-width: 400px;
            "></div>
        `);
    }
}

// Global function to show notifications
window.showNotification = function(message, type = 'success', duration = 4000) {
    console.log('Showing notification:', message, type);

    const icon = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    }[type] || '📢';

    const notificationId = 'notification-' + Date.now();

    const notification = $(`
        <div id="${notificationId}" class="custom-notification custom-notification-${type}" style="
            background: linear-gradient(135deg, ${getNotificationColor(type)});
            color: white;
            padding: 16px 20px;
            margin-bottom: 10px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border-left: 4px solid ${getNotificationBorderColor(type)};
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            max-width: 400px;
            min-width: 300px;
        ">
            <span class="notification-icon" style="font-size: 1.4em;">${icon}</span>
            <span class="notification-message" style="flex: 1; font-weight: 500;">${message}</span>
            <button class="notification-close" style="
                background: none;
                border: none;
                color: white;
                font-size: 1.2em;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">×</button>
        </div>
    `);

    $('#notification-container').append(notification);

    // Animate in
    setTimeout(() => {
        notification.css({
            'transform': 'translateX(0)',
            'opacity': '1'
        });
    }, 100);

    // Close button handler
    notification.find('.notification-close').on('click', function() {
        closeNotification(notificationId);
    });

    // Auto close after duration
    if (duration > 0) {
        setTimeout(() => {
            closeNotification(notificationId);
        }, duration);
    }

    return notificationId;
};

function closeNotification(id) {
    const notification = $('#' + id);
    if (notification.length) {
        notification.css({
            'transform': 'translateX(400px)',
            'opacity': '0'
        });
        setTimeout(() => {
            notification.remove();
        }, 400);
    }
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745, #20c997',
        error: '#dc3545, #e83e8c',
        info: '#17a2b8, #6f42c1',
        warning: '#ffc107, #fd7e14'
    };
    return colors[type] || colors.info;
}

function getNotificationBorderColor(type) {
    const colors = {
        success: '#1e7e34',
        error: '#c82333',
        info: '#138496',
        warning: '#e0a800'
    };
    return colors[type] || colors.info;
}

// Task 8: Copy to Clipboard Button
function initCopyToClipboard() {
    // Add copy buttons to code snippets or specific text
    $('.card-text').each(function(index) {
        if ($(this).text().length > 50) {
            const copyBtn = $(`
                <button class="btn btn-sm btn-outline-light mt-2 copy-btn" data-index="${index}">
                    <span class="copy-icon">📋</span> Copy
                </button>
            `);

            $(this).after(copyBtn);
        }
    });

    $('.copy-btn').on('click', function() {
        const $btn = $(this);
        const text = $btn.prev('.card-text').text();

        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            $btn.html('<span class="copy-icon">✓</span> Copied!').addClass('btn-success');

            showNotification('Copied to clipboard!', 'success');

            setTimeout(() => {
                $btn.html('<span class="copy-icon">📋</span> Copy').removeClass('btn-success');
            }, 2000);
        }).catch(err => {
            showNotification('Failed to copy', 'error');
        });
    });
}

// Task 9: Image Lazy Loading
function initLazyLoading() {
    $('img').each(function() {
        const $img = $(this);
        const src = $img.attr('src');

        // Store original src and replace with placeholder
        if (src && !$img.hasClass('lazy-loaded')) {
            $img.attr('data-src', src)
                .attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
                .addClass('lazy-load');
        }
    });

    function lazyLoad() {
        $('.lazy-load').each(function() {
            const $img = $(this);
            const imgTop = $img.offset().top;
            const imgBottom = imgTop + $img.height();
            const windowTop = $(window).scrollTop();
            const windowBottom = windowTop + $(window).height();

            if (imgBottom > windowTop && imgTop < windowBottom + 200) {
                const src = $img.attr('data-src');
                if (src) {
                    $img.attr('src', src)
                        .removeClass('lazy-load')
                        .addClass('lazy-loaded')
                        .on('load', function() {
                            $(this).addClass('loaded');
                        });
                }
            }
        });
    }

    $(window).on('scroll resize', lazyLoad);
    lazyLoad(); // Initial load
}

// ===== HELPER FUNCTIONS =====

function clearSearch() {
    $('#searchInput').val('');
    $('#categoryFilter').val('');
    performSearch();
    $('#searchInput').focus();
}

function updateResultsCounter(visible, total, hasFilters) {
    // Remove existing counter
    $('.results-counter').remove();

    if (hasFilters) {
        const counter = $(`
            <div class="results-counter alert alert-info mt-3">
                <strong>${visible}</strong> of <strong>${total}</strong> games found
                <button class="btn btn-sm btn-outline-danger ms-3" onclick="clearSearch()">
                    Show All Games
                </button>
            </div>
        `);
        $('.search-form-container').after(counter);
    }
}

// Make functions globally available
window.performSearch = performSearch;
window.clearSearch = clearSearch;

// ===== EXISTING FUNCTIONS (KEEP THESE) =====

function initDateTime() {
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

        $('#datetime-display').html(`
            <div class="alert alert-dark text-center">
                <div class="fw-bold text-danger">📅 Current Date & Time</div>
                <div class="mt-2">${formattedDate}</div>
            </div>
        `);
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
}

function initWelcomeAlert() {
    if (localStorage.getItem('welcomeShown')) {
        return;
    }

    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) {
        greeting = "Good morning, Hollow! ☀️";
    } else if (hour < 18) {
        greeting = "Good afternoon, Ashen One! ⚔️";
    } else {
        greeting = "Good evening, Hunter! 🌙";
    }

    const alertDiv = $(`
        <div class="custom-welcome-alert">
            <div class="welcome-alert-content">
                <span class="welcome-close">&times;</span>
                <h3 class="text-danger mb-3">🎮 Welcome to Souls-like Games</h3>
                <p class="mb-3">${greeting}</p>
                <p class="mb-3">Ready to conquer some bosses?</p>
                <div class="input-group mb-3">
                    <input type="text" id="welcome-name-input" class="form-control bg-dark text-white" placeholder="Enter your name">
                    <button id="welcome-submit" class="btn btn-danger">Continue</button>
                </div>
            </div>
        </div>
    `);

    $('body').append(alertDiv);

    setTimeout(() => alertDiv.addClass('show'), 500);

    function closeWelcome(userName) {
        alertDiv.removeClass('show');
        setTimeout(() => alertDiv.remove(), 300);
        localStorage.setItem('welcomeShown', 'true');
        if (userName) {
            localStorage.setItem('userName', userName);
            showNotification(`Welcome, ${userName}! Happy gaming!`, 'success');
        }
    }

    $('#welcome-submit').on('click', function() {
        const name = $('#welcome-name-input').val().trim();
        if (name) {
            closeWelcome(name);
        } else {
            showNotification('Please enter your name', 'error');
        }
    });

    $('#welcome-name-input').on('keypress', function(e) {
        if (e.which === 13) {
            $('#welcome-submit').click();
        }
    });

    $('.welcome-close').on('click', () => closeWelcome());
}

const soulsFacts = [
    "Dark Souls was inspired by the manga Berserk and classical European architecture.",
    "Hollow Knight was developed by just 3 people at Team Cherry.",
    "Elden Ring sold over 20 million copies in its first year.",
    "Sekiro: Shadows Die Twice won Game of the Year in 2019.",
    "The term 'Souls-like' was coined by the gaming community to describe games with similar mechanics to Dark Souls.",
    "Bloodborne's combat system encourages aggressive play with its rally mechanic.",
    "The average player dies over 100 times in their first Dark Souls playthrough.",
    "Nioh combines Souls-like combat with Diablo-style loot systems.",
    "FromSoftware's president, Hidetaka Miyazaki, directed Demon's Souls, which started the genre.",
    "Dark Souls 3 references all previous FromSoftware titles in subtle ways.",
    "The bonfire mechanic was inspired by camping in fantasy novels.",
    "Praise the Sun! is one of the most iconic gestures in gaming history."
];

let currentFactIndex = 0;
let factInterval;

function displayRandomFact() {
    const factContainer = $('#random-fact-container');
    if (factContainer.length === 0) return;

    const fact = soulsFacts[currentFactIndex];

    factContainer.html(`
        <div class="fact-content" onclick="changeFactManually()">
            <div class="fact-icon">💡</div>
            <p class="fact-text mb-0">${fact}</p>
            <small class="fact-hint">Click to change • Auto-updates every 20s</small>
        </div>
    `);

    factContainer.find('.fact-content').css({
        'opacity': '0',
        'transform': 'translateY(20px)'
    }).animate({
        opacity: 1
    }, 500).css('transform', 'translateY(0)');
}

function changeFactManually() {
    currentFactIndex = (currentFactIndex + 1) % soulsFacts.length;
    displayRandomFact();
    playSound();
}

function startFactRotation() {
    displayRandomFact();
    factInterval = setInterval(() => {
        currentFactIndex = (currentFactIndex + 1) % soulsFacts.length;
        displayRandomFact();
    }, 20000);
}

function initCardRatings() {
    $('.game-card').each(function(cardIndex) {
        const cardBody = $(this).find('.card-body');
        if (cardBody.length === 0) return;

        const ratingContainer = $(`
            <div class="card-rating-system mt-3 mb-3">
                <div class="rating-label text-center mb-2">
                    <small class="text-muted">Rate this game:</small>
                </div>
                <div class="rating-stars-small text-center" data-card="${cardIndex}">
                    <span class="star-small" data-rating="1">★</span>
                    <span class="star-small" data-rating="2">★</span>
                    <span class="star-small" data-rating="3">★</span>
                    <span class="star-small" data-rating="4">★</span>
                    <span class="star-small" data-rating="5">★</span>
                </div>
                <div class="rating-display-small text-center mt-2">
                    <small class="text-muted" id="rating-${cardIndex}">Not rated</small>
                </div>
            </div>
        `);

        const buttonGroup = cardBody.find('.btn-group');
        if (buttonGroup.length) {
            buttonGroup.parent().prepend(ratingContainer);
        } else {
            cardBody.append(ratingContainer);
        }

        let currentRating = 0;

        ratingContainer.find('.star-small').on('click', function() {
            const rating = parseInt($(this).data('rating'));
            currentRating = rating;
            updateCardStars(ratingContainer.find('.star-small'), rating);
            $(`#rating-${cardIndex}`).text(`${rating}/5 ⭐`)
                .removeClass('text-muted').addClass('text-warning');
            playSound();
        }).on('mouseover', function() {
            const rating = parseInt($(this).data('rating'));
            updateCardStars(ratingContainer.find('.star-small'), rating, true);
        }).on('mouseout', function() {
            updateCardStars(ratingContainer.find('.star-small'), currentRating);
        });
    });
}

function updateCardStars(stars, rating, isHover = false) {
    stars.each(function(index) {
        if (index < rating) {
            $(this).css({
                'color': '#ffd700',
                'text-shadow': '0 0 8px gold',
                'transform': 'scale(1.1)'
            });
        } else {
            $(this).css({
                'color': isHover ? '#ffd70066' : '#666',
                'text-shadow': 'none',
                'transform': 'scale(1)'
            });
        }
    });
}

function initRatingSystem() {
    const stars = $('.star');
    const ratingDisplay = $('#rating-display');
    let currentRating = 0;

    stars.on('click', function() {
        const rating = parseInt($(this).data('rating'));
        currentRating = rating;
        updateStars(rating);
        ratingDisplay.text(`Your rating: ${rating}/5`).attr('class', 'mb-0 text-success');
        playSound();
    }).on('mouseover', function() {
        const rating = parseInt($(this).data('rating'));
        updateStars(rating, true);
    }).on('mouseout', function() {
        updateStars(currentRating);
    });

    function updateStars(rating, isHover = false) {
        stars.each(function(index) {
            if (index < rating) {
                $(this).css({
                    'color': '#ffd700',
                    'text-shadow': '0 0 10px gold',
                    'transform': 'scale(1.2)'
                });
            } else {
                $(this).css({
                    'color': isHover ? '#ffd70066' : '#666',
                    'text-shadow': 'none',
                    'transform': 'scale(1)'
                });
            }
        });
    }
}

function initThemeSystem() {
    const dayThemeBtn = $('#day-theme');
    const nightThemeBtn = $('#night-theme');
    const themeToggleBtn = $('#theme-toggle');
    const randomColorBtn = $('#random-color');

    const themes = {
        day: {
            background: '#f8f9fa',
            text: '#212529',
            card: '#ffffff',
            accent: '#dc3545',
            dark: '#e9ecef',
            secondary: '#f8f9fa',
            border: '#dee2e6'
        },
        night: {
            background: '#0a0a0a',
            text: '#e0e0e0',
            card: '#1a1a1a',
            accent: '#dc3545',
            dark: '#151515',
            secondary: '#2a2a2a',
            border: '#333'
        }
    };

    function applyTheme(theme) {
        $('body').css({
            'backgroundColor': theme.background,
            'color': theme.text,
            'transition': 'all 0.5s ease'
        });

        $('.card').css({
            'backgroundColor': theme.card,
            'color': theme.text,
            'borderColor': theme.border,
            'transition': 'all 0.5s ease'
        });

        $('.bg-dark').css({
            'backgroundColor': theme.dark,
            'color': theme.text,
            'transition': 'all 0.5s ease'
        });

        $('.bg-secondary').css({
            'backgroundColor': theme.secondary,
            'color': theme.text,
            'transition': 'all 0.5s ease'
        });

        localStorage.setItem('theme', theme === themes.day ? 'day' : 'night');
    }

    dayThemeBtn.on('click', () => {
        applyTheme(themes.day);
        playSound();
    });

    nightThemeBtn.on('click', () => {
        applyTheme(themes.night);
        playSound();
    });

    themeToggleBtn.on('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'night';
        const newTheme = currentTheme === 'night' ? 'day' : 'night';
        applyTheme(themes[newTheme]);
        playSound();
    });

    randomColorBtn.on('click', () => {
        const colors = ['#1a0f1f', '#0f1a1a', '#1a1a0f', '#1f0f0f', '#0f0f1f'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        $('body').css({
            'backgroundColor': randomColor,
            'transition': 'background-color 0.5s ease'
        });
        playSound();
    });

    const savedTheme = localStorage.getItem('theme') || 'night';
    applyTheme(themes[savedTheme]);
}

function initButtonEvents() {
    $('#time-btn').on('click', function() {
        const timeDisplay = $('#time-display');
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        timeDisplay.html(`
            <div class="alert alert-info">
                <h4>🕒 Current Time</h4>
                <p class="mb-0 fs-4">${timeString}</p>
            </div>
        `);

        animateElement(timeDisplay);
        playSound();
    });

    $('#sound-btn').on('click', function() {
        playSound();
        $(this).text('🔊 Playing...').addClass('btn-success');
        setTimeout(() => {
            $(this).text('🔊 Play Sound').removeClass('btn-success');
        }, 1000);
    });

    $('#animate-btn').on('click', function() {
        animateCards();
        playSound();
    });

    $('#greet-btn').on('click', function() {
        const nameInput = $('#name-input');
        const greetingDisplay = $('#greeting-display');
        const name = nameInput.val().trim();

        if (name) {
            const hour = new Date().getHours();
            let greeting;

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

            greetingDisplay.text(greeting).attr('class', 'text-center text-success fade-in');

            setTimeout(() => {
                greetingDisplay.attr('class', 'text-center');
            }, 3000);

            playSound();
        } else {
            greetingDisplay.text('Please enter your name first!')
                .attr('class', 'text-center text-danger');
        }
    });

    $('#load-content').on('click', function() {
        loadRandomContent();
        playSound();
    });
}

function initKeyboardNavigation() {
    let currentFocus = 0;
    const focusableElements = $('button, a, input, select, textarea');

    $(document).on('keydown', function(e) {
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                currentFocus = (currentFocus + 1) % focusableElements.length;
                focusableElements.eq(currentFocus).focus();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                currentFocus = (currentFocus - 1 + focusableElements.length) % focusableElements.length;
                focusableElements.eq(currentFocus).focus();
                break;
            case 'Enter':
                if ($(e.target).is('#name-input')) {
                    $('#greet-btn').click();
                }
                break;
        }
    });
}

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

function loadRandomContent() {
    const contentArea = $('#content-area');
    const randomFact = soulsFacts[Math.floor(Math.random() * soulsFacts.length)];

    contentArea.html(`
        <div class="alert alert-dark">
            <h5>🎮 Souls-like Fact</h5>
            <p class="mb-0">${randomFact}</p>
        </div>
    `);

    animateElement(contentArea);
}

function playSound() {
    const sound = $('#sound-effect')[0];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function animateCards() {
    $('.card').each(function(index) {
        const $card = $(this);

        $card.css({
            'transform': 'scale(0.9)',
            'opacity': '0.5'
        });

        setTimeout(() => {
            $card.css({
                'transition': 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'transform': 'scale(1.05) rotateY(10deg)',
                'opacity': '1',
                'box-shadow': '0 15px 35px rgba(220, 53, 69, 0.4)'
            });

            setTimeout(() => {
                $card.css({
                    'transform': 'scale(1) rotateY(0)',
                    'box-shadow': ''
                });
            }, 600);
        }, index * 100);
    });
}

function animateElement(element) {
    if (!element.length) return;

    element.css({
        'transform': 'scale(0.8)',
        'opacity': '0'
    });

    setTimeout(() => {
        element.css({
            'transition': 'all 0.5s ease',
            'transform': 'scale(1)',
            'opacity': '1'
        });
    }, 50);
}

function initMultiStepForm() {
    const form = $('#contact-form');
    if (form.length === 0) return;

    let currentStep = 1;
    const totalSteps = 3;

    function showStep(step) {
        $('.form-step').hide();
        $(`#step-${step}`).show();
        updateProgress(step);
    }

    function updateProgress(step) {
        const progress = $('#form-progress');
        if (progress.length) {
            const percentage = ((step - 1) / (totalSteps - 1)) * 100;
            progress.css('width', `${percentage}%`);
        }
    }

    function validateStep(step) {
        let isValid = true;

        switch(step) {
            case 1:
                const name = $('#name');
                const email = $('#email');

                if (!name.val().trim() || name.val().trim().length < 2) {
                    showError('name', 'Name is required and must be at least 2 characters');
                    isValid = false;
                } else {
                    showSuccess('name');
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email.val().trim() || !emailRegex.test(email.val())) {
                    showError('email', 'Please enter a valid email address');
                    isValid = false;
                } else {
                    showSuccess('email');
                }
                break;

            case 2:
                const subject = $('#subject');
                const message = $('#message');

                if (!subject.val()) {
                    showError('subject', 'Please select a subject');
                    isValid = false;
                } else {
                    showSuccess('subject');
                }

                if (!message.val().trim() || message.val().trim().length < 10) {
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
        $('#review-name').text($('#name').val());
        $('#review-email').text($('#email').val());
        $('#review-subject').text($('#subject option:selected').text());
        $('#review-message').text($('#message').val());
    }

    $('.next-step').on('click', function() {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            currentStep++;
            if (currentStep === totalSteps) {
                updateReview();
            }
            showStep(currentStep);
            playSound();
        }
    });

    $('.prev-step').on('click', function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            playSound();
        }
    });

    // Form submission handled in initLoadingSpinner
    showStep(1);
}

function initGameFiltering() {
    $('.filter-btn').on('click', function() {
        const filter = $(this).data('filter');

        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        $('.game-card').each(function() {
            const $card = $(this);
            if (filter === 'all' || $card.data('category') === filter) {
                $card.show().css({
                    'opacity': '1',
                    'transform': 'scale(1)'
                });
            } else {
                $card.css({
                    'opacity': '0',
                    'transform': 'scale(0.8)'
                });
                setTimeout(() => $card.hide(), 300);
            }
        });

        playSound();
    });
}

function initLanguageSelector() {
    const languageSelect = $('#language-select');
    if (languageSelect.length === 0) return;

    const translations = {
        en: {
            welcome: "SOULS-LIKE GAMES",
            home: "Home",
            about: "About",
            contact: "Contact",
            library: "Library"
        },
        kk: {
            welcome: "SOULS-LIKE ОЙЫНДАРЫ",
            home: "Басты Бет",
            about: "Біз туралы",
            contact: "Байланыс",
            library: "Кітапхана"
        },
        ru: {
            welcome: "SOULS-LIKE ИГРЫ",
            home: "Главная",
            about: "О нас",
            contact: "Контакты",
            library: "Библиотека"
        }
    };

    languageSelect.on('change', function() {
        const lang = $(this).val();
        const translation = translations[lang];

        $('[data-translate]').each(function() {
            const key = $(this).data('translate');
            if (translation[key]) {
                $(this).text(translation[key]);
            }
        });

        $('.nav-link').each(function() {
            const text = $(this).text().trim();
            if (translation[text.toLowerCase()]) {
                $(this).text(translation[text.toLowerCase()]);
            }
        });

        localStorage.setItem('preferred-language', lang);
        playSound();
    });

    const savedLang = localStorage.getItem('preferred-language') || 'en';
    languageSelect.val(savedLang).trigger('change');
}

function showError(fieldId, errorMessage) {
    const field = $(`#${fieldId}`);
    const errorElement = $(`#${fieldId}-error`);

    field.addClass('error').removeClass('success');
    errorElement.text(errorMessage).show();
}

function showSuccess(fieldId) {
    const field = $(`#${fieldId}`);
    const errorElement = $(`#${fieldId}-error`);

    field.addClass('success').removeClass('error');
    errorElement.hide();
}

function resetErrors() {
    $('.error-message').hide();
    $('.form-control, .form-select').removeClass('error success');
}

function initAccordion() {
    $('.accordion-item').each(function() {
        const $item = $(this);
        const header = $item.find('.accordion-header');
        const content = $item.find('.accordion-content');

        if (header.length && content.length) {
            header.on('click', function() {
                const isActive = $item.hasClass('active');

                $('.accordion-item').removeClass('active').find('.accordion-content').css({
                    'max-height': '0',
                    'padding': '0 1rem'
                });

                if (!isActive) {
                    $item.addClass('active');
                    content.css({
                        'max-height': content[0].scrollHeight + 'px',
                        'padding': '1rem'
                    });
                    playSound();
                }
            });
        }
    });
}

function enhanceExistingCards() {
    $('.card').on('mouseenter', function() {
        $(this).css({
            'transform': 'translateY(-10px) scale(1.02)',
            'transition': 'all 0.3s ease'
        });
    }).on('mouseleave', function() {
        $(this).css('transform', 'translateY(0) scale(1)');
    });
}

// Test function for notifications
window.testNotificationSystem = function() {
    showNotification('Form submitted successfully!', 'success');
    setTimeout(() => showNotification('Error: Please check your input', 'error'), 1500);
    setTimeout(() => showNotification('New message received', 'info'), 3000);
};