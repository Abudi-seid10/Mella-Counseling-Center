// Navigation Scroll Effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const loadingIndicator = document.getElementById('loading-indicator');

            try {
                // Show loading state
                submitBtn.disabled = true;
                loadingIndicator.classList.remove('d-none');

                const formData = new FormData(form);
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Form submission failed');
                }

                // Show success message
                showNotification('Thank you! We will contact you soon.', 'success');
                form.reset();

            } catch (error) {
                showNotification('Something went wrong. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                loadingIndicator.classList.add('d-none');
            }
        });
    });
});

// Fade In Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            showInputError(input, 'This field is required');
        } else if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid email address');
            }
        } else if (input.type === 'tel' && input.value) {
            const phoneRegex = /^\+?[\d\s-]{10,}$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid phone number');
            }
        }
    });

    return isValid;
}

function showInputError(input, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;

    input.classList.add('is-invalid');
    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('invalid-feedback')) {
        input.parentNode.insertBefore(errorDiv, input.nextElementSibling);
    }

    input.addEventListener('input', function() {
        this.classList.remove('is-invalid');
        const feedback = this.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }, { once: true });
}

// Responsive Image Loading
function loadResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        const mobileSrc = img.getAttribute('data-src-mobile');
        const desktopSrc = img.getAttribute('data-src');
        
        if (window.innerWidth <= 768 && mobileSrc) {
            img.src = mobileSrc;
        } else {
            img.src = desktopSrc;
        }
        
        img.removeAttribute('data-src');
        img.removeAttribute('data-src-mobile');
    });
}

// Initialize responsive images
window.addEventListener('load', loadResponsiveImages);
window.addEventListener('resize', loadResponsiveImages);

// Add CSRF token to all AJAX requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (csrfToken) {
    document.addEventListener('DOMContentLoaded', () => {
        const headers = new Headers({
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json'
        });
    });
}
