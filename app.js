// DOM Elements
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const heroButton = document.getElementById('hero-button');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
        
        // Toggle hamburger animation
        const spans = mobileMenuButton.querySelectorAll('span');
        if (mobileMenu.classList.contains('hidden')) {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        } else {
            spans[0].style.transform = 'rotate(-45deg) translate(-6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-6px, -6px)';
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuButton && mobileMenu && 
        !mobileMenuButton.contains(e.target) && 
        !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        
        // Reset hamburger animation
        const spans = mobileMenuButton.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = 80; // Account for sticky header
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: Math.max(0, sectionTop),
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const spans = mobileMenuButton.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
        
        // Update active nav link
        setTimeout(() => {
            updateActiveNavLink();
        }, 100);
    }
}

// Handle navigation link clicks
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    scrollToSection(targetId);
}

// Add event listeners to all navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Desktop navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Mobile navigation links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Hero button
    if (heroButton) {
        heroButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection('projects');
        });
    }
    
    // Project buttons
    document.querySelectorAll('.project-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Project demo will be available soon!', 'info');
        });
    });
    
    // Footer links
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('This is a placeholder link for the portfolio demo.', 'info');
        });
    });
    
    // GitHub link
    document.querySelectorAll('.github-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('GitHub profile will be available soon!', 'info');
        });
    });
    
    // Initialize active nav link
    updateActiveNavLink();
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = 80;
    const scrollPosition = window.scrollY + headerHeight + 100;
    
    let activeSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            activeSection = section.getAttribute('id');
        }
    });
    
    // Remove active classes from all nav links
    const allNavLinks = [...document.querySelectorAll('.nav-link'), ...document.querySelectorAll('.mobile-nav-link')];
    allNavLinks.forEach(link => {
        link.classList.remove('text-blue-600', 'font-semibold');
        link.classList.add('text-gray-700');
    });
    
    // Add active class to current section link
    if (activeSection) {
        const activeLinks = document.querySelectorAll(`a[href="#${activeSection}"]`);
        activeLinks.forEach(link => {
            if (link.classList.contains('nav-link') || link.classList.contains('mobile-nav-link')) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-blue-600', 'font-semibold');
            }
        });
    }
}

// Update active nav link on scroll with debouncing
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavLink, 10);
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.classList.add('opacity-70', 'cursor-not-allowed');
        
        // Simulate API call delay
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
            contactForm.reset();
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        }, 1500);
    });
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-5 right-5 z-50 max-w-sm p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ease-out';
    
    // Set colors based on type
    const colorClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.classList.add(...(colorClasses[type] || colorClasses.info).split(' '));
    
    notification.innerHTML = `
        <div class="flex justify-between items-center">
            <span class="text-sm font-medium pr-4">${message}</span>
            <button class="text-white hover:text-gray-200 text-xl leading-none flex-shrink-0" aria-label="Close">&times;</button>
        </div>
    `;
    
    // Close button functionality
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', () => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add to DOM and animate
    document.body.appendChild(notification);
    
    // Force reflow and animate in
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full');
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (mobileMenuButton) {
            const spans = mobileMenuButton.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('backdrop-blur-sm');
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.classList.remove('backdrop-blur-sm');
            header.style.backgroundColor = 'white';
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to elements on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for DOM to fully load
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.bg-white.rounded-lg.shadow-md');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(element);
        });
    }, 100);
});

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Backup smooth scroll implementation for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    function smoothScrollTo(targetY, duration = 500) {
        const startY = window.pageYOffset;
        const difference = targetY - startY;
        const startTime = performance.now();

        function step() {
            const progress = Math.min((performance.now() - startTime) / duration, 1);
            const ease = progress * (2 - progress); // easeOutQuad
            window.scrollTo(0, startY + difference * ease);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    // Override the scroll function for browsers without smooth scroll support
    const originalScrollToSection = scrollToSection;
    scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = 80;
            const sectionTop = section.offsetTop - headerHeight;
            smoothScrollTo(Math.max(0, sectionTop));
            
            // Close mobile menu and update nav
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const spans = mobileMenuButton.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
            
            setTimeout(() => {
                updateActiveNavLink();
            }, 100);
        }
    };
}