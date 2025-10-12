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
            <div>📅 Current Date & Time</div>
            <div style="font-weight: bold;">${formattedDate}</div>
        `;
    }
}

// Update datetime every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Task 1: Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
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
            if (!password.value || password.value.length < 8) {
                showError('password', 'Password must be at least 8 characters');
                isValid = false;
            } else {
                showSuccess('password');
            }
            
            // Validate Password Confirmation
            const confirmPassword = document.getElementById('confirmPassword');
            if (!confirmPassword.value || confirmPassword.value !== password.value) {
                showError('confirmPassword', 'Passwords do not match');
                isValid = false;
            } else {
                showSuccess('confirmPassword');
            }
            
            // Validate Subject
            const subject = document.getElementById('subject');
            if (!subject.value) {
                showError('subject', 'Please select a subject');
                isValid = false;
            } else {
                showSuccess('subject');
            }
            
            // Validate Message
            const message = document.getElementById('message');
            if (!message.value.trim() || message.value.trim().length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            } else {
                showSuccess('message');
            }
            
            // If form is valid, show success message
            if (isValid) {
                alert('Form submitted successfully! Thank you for contacting us.');
                contactForm.reset();
                resetErrors();
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

// Task 3: Popup Subscription Form
const subscribeBtn = document.getElementById('subscribe-btn');
const popupOverlay = document.getElementById('popup-overlay');
const popupForm = document.getElementById('popup-form');
const popupClose = document.getElementById('popup-close');
const subscriptionForm = document.getElementById('subscription-form');

if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function() {
        showPopup();
    });
}

if (popupClose) {
    popupClose.addEventListener('click', function() {
        hidePopup();
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

// Task 4: Change Background Color
const colorChangeBtn = document.getElementById('color-change-btn');
const colors = [
    '#0a0a0a', // Original dark
    '#1a0f1f', // Dark purple
    '#0f1a1a', // Dark teal
    '#1a1a0f', // Dark olive
    '#1f0f0f', // Dark red
    '#0f0f1f', // Dark blue
    '#1a0a14', // Dark brown
    '#141a0a', // Dark green
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
    });
}

// Task 2: Accordion for FAQs
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
                }
            });
        }
    });
}

// Initialize accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', initAccordion);