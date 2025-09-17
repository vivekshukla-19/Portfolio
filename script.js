"use strict";

// ===== PERFORMANCE OPTIMIZATIONS =====
const passiveEventOptions = { passive: true };
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== NAVBAR FUNCTIONALITY =====
(function () {
    const navToggle = document.getElementById('navbar-toggle');
    const navLinks = document.getElementById('navbar-links');
    const navbar = document.querySelector('.navbar');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            navLinks.classList.toggle('active');
        });
        // Close menu when clicking a link (mobile)
        navLinks.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.tagName === 'A') {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const onScroll = throttle(() => {
        if (!navbar) return;
        const scrolled = window.scrollY > 8;
        navbar.classList.toggle('scrolled', scrolled);
    }, 16); // ~60fps
    
    document.addEventListener('scroll', onScroll, passiveEventOptions);

    // Active link highlight
    if (navLinks) {
        const sectionIds = ['about', 'projects', 'skills', 'contact'];
        const sections = sectionIds
            .map(id => document.getElementById(id))
            .filter(Boolean);
        const links = Array.from(navLinks.querySelectorAll('a'));

        if (sections.length && links.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = entry.target.id;
                    const link = links.find(a => a.getAttribute('href') === `#${id}`);
                    if (link) {
                        if (entry.isIntersecting) {
                            links.forEach(a => a.classList.remove('active'));
                            link.classList.add('active');
                        }
                    }
                });
            }, { rootMargin: '0px 0px -70% 0px', threshold: 0.2 });

            sections.forEach(sec => observer.observe(sec));
        }
    }
})();

// ===== SCROLL TO TOP BUTTON =====
(function () {
    const toTop = document.getElementById('toTop');
    if (!toTop) return;
    
    const toggleToTop = throttle(() => {
        const shouldShow = window.scrollY > 300;
        toTop.style.display = shouldShow ? 'grid' : 'none';
    }, 100);
    
    document.addEventListener('scroll', toggleToTop, passiveEventOptions);
    
    toTop.addEventListener('click', () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    });
})();

// ===== CONTACT FORM SUBMISSION =====
(function () {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusBox = document.getElementById('form-status');
    
    if (!contactForm || !submitBtn || !statusBox) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        statusBox.textContent = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const formData = new FormData(contactForm);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            const result = await response.json();
            if (response.ok && result.success) {
                statusBox.textContent = '✅ Message sent successfully! I will get back to you soon.';
                statusBox.classList.remove('error');
                statusBox.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Failed to send message. Please try again later.');
            }
        } catch (err) {
            const errorMessage = err.name === 'AbortError' ? 
                'Request timed out. Please try again.' : 
                `❌ ${err.message}`;
            statusBox.textContent = errorMessage;
            statusBox.classList.remove('success');
            statusBox.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
})();

// ===== TYPED TEXT ANIMATION =====
document.addEventListener("DOMContentLoaded", function () {
    const roles = [
        "Final-year BCA Student",
        "Future MCA",
        "Web Developer",
        "Python Enthusiast",
        "Aspiring DevOps Engineer",
        "Cloud Computing Learner"
    ];

    let i = 0, j = 0, current = "", isDeleting = false;
    let isPaused = false;
    let animationId;

    function type() {
        const textSpan = document.getElementById("typed-text");
        if (!textSpan) return;

        if (i < roles.length) {
            if (!isDeleting) {
                current = roles[i].slice(0, j++);
                textSpan.textContent = current;

                if (j > roles[i].length) {
                    isPaused = true;
                    animationId = setTimeout(() => {
                        isDeleting = true;
                        isPaused = false;
                        type();
                    }, 1500);
                    return;
                }
            } else {
                current = roles[i].slice(0, j--);
                textSpan.textContent = current;

                if (j < 0) {
                    isDeleting = false;
                    i = (i + 1) % roles.length;
                }
            }

            animationId = setTimeout(type, isDeleting ? 50 : 120);
        }
    }

    // Start animation with intersection observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationId) {
                type();
            }
        });
    }, { threshold: 0.5 });
    
    const typedTextElement = document.getElementById("typed-text");
    if (typedTextElement) {
        observer.observe(typedTextElement.parentElement);
    }
});

// ===== ADDITIONAL PERFORMANCE OPTIMIZATIONS =====

// Lazy load images when they come into view
(function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
})();

// Preload critical resources
(function() {
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.onload = function() {
            this.onload = null;
            this.rel = 'stylesheet';
        };
        document.head.appendChild(link);
    });
})();

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

