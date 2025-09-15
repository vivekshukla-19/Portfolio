"use strict";

// Navbar toggle and sticky shadow
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

    const onScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 8) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    document.addEventListener('scroll', onScroll, { passive: true });

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

// Scroll to top button
(function () {
    const toTop = document.getElementById('toTop');
    if (!toTop) return;
    const toggleToTop = () => {
        toTop.style.display = window.scrollY > 300 ? 'grid' : 'none';
    };
    document.addEventListener('scroll', toggleToTop, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Contact form submission (Web3Forms)
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
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

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
            statusBox.textContent = `❌ ${err.message}`;
            statusBox.classList.remove('success');
            statusBox.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
})();


