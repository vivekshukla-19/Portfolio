// Advanced Analytics Setup for Portfolio Website
// This file provides multiple analytics options and performance monitoring

// ===== GOOGLE ANALYTICS 4 SETUP =====
const initGoogleAnalytics = () => {
    // Replace with your actual GA4 Measurement ID
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 ID
    
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.log('Google Analytics not configured. Please add your GA4 Measurement ID.');
        return;
    }

    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
            'custom_parameter_1': 'portfolio_visitor',
            'custom_parameter_2': 'devops_engineer'
        }
    });

    // Track custom events
    const trackEvent = (eventName, parameters = {}) => {
        gtag('event', eventName, {
            event_category: 'Portfolio',
            event_label: parameters.label || '',
            value: parameters.value || 0,
            ...parameters
        });
    };

    // Track portfolio interactions
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href*="github.com"]')) {
            trackEvent('github_click', {
                label: e.target.href,
                value: 1
            });
        }
        
        if (e.target.matches('a[href*="linkedin.com"]')) {
            trackEvent('linkedin_click', {
                label: e.target.href,
                value: 1
            });
        }
        
        if (e.target.matches('.project-link')) {
            trackEvent('project_view', {
                label: e.target.textContent.trim(),
                value: 1
            });
        }
        
        if (e.target.matches('.contact-form button[type="submit"]')) {
            trackEvent('contact_form_submit', {
                label: 'Contact Form',
                value: 1
            });
        }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = throttle(() => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
            maxScrollDepth = scrollDepth;
            trackEvent('scroll_depth', {
                label: `${scrollDepth}%`,
                value: scrollDepth
            });
        }
    }, 1000);

    window.addEventListener('scroll', trackScrollDepth);

    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            label: 'Portfolio Visit',
            value: timeOnPage
        });
    });

    console.log('Google Analytics 4 initialized');
};

// ===== PLAUSIBLE ANALYTICS SETUP =====
const initPlausibleAnalytics = () => {
    // Replace with your actual Plausible domain
    const PLAUSIBLE_DOMAIN = 'vivekshukla.dev'; // Replace with your domain
    
    if (!PLAUSIBLE_DOMAIN || PLAUSIBLE_DOMAIN === 'vivekshukla.dev') {
        console.log('Plausible Analytics not configured. Please add your domain.');
        return;
    }

    // Load Plausible script
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = PLAUSIBLE_DOMAIN;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);

    // Track custom events
    const trackPlausibleEvent = (eventName, props = {}) => {
        window.plausible(eventName, { props });
    };

    // Track portfolio interactions
    document.addEventListener('click', (e) => {
        if (e.target.matches('a[href*="github.com"]')) {
            trackPlausibleEvent('GitHub Click', { source: 'portfolio' });
        }
        
        if (e.target.matches('a[href*="linkedin.com"]')) {
            trackPlausibleEvent('LinkedIn Click', { source: 'portfolio' });
        }
        
        if (e.target.matches('.project-link')) {
            trackPlausibleEvent('Project View', { 
                project: e.target.textContent.trim(),
                source: 'portfolio' 
            });
        }
        
        if (e.target.matches('.contact-form button[type="submit"]')) {
            trackPlausibleEvent('Contact Form Submit', { source: 'portfolio' });
        }
    });

    console.log('Plausible Analytics initialized');
};

// ===== PERFORMANCE MONITORING =====
const initPerformanceMonitoring = () => {
    // Core Web Vitals monitoring
    const vitalsReporter = (metric) => {
        console.log('Web Vital:', metric.name, metric.value);
        
        // Send to analytics (if configured)
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.value),
                non_interaction: true
            });
        }
        
        if (typeof window.plausible !== 'undefined') {
            window.plausible(metric.name, {
                props: {
                    value: Math.round(metric.value),
                    id: metric.id
                }
            });
        }
    };

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            vitalsReporter({
                name: 'LCP',
                value: entry.startTime,
                id: entry.id
            });
        }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            vitalsReporter({
                name: 'FID',
                value: entry.processingStart - entry.startTime,
                id: entry.id
            });
        }
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
            }
        }
        vitalsReporter({
            name: 'CLS',
            value: clsValue,
            id: 'portfolio-cls'
        });
    }).observe({ entryTypes: ['layout-shift'] });

    // Resource timing
    window.addEventListener('load', () => {
        setTimeout(() => {
            const resources = performance.getEntriesByType('resource');
            const totalLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            
            console.log('Page Load Time:', totalLoadTime + 'ms');
            console.log('Resources Loaded:', resources.length);
            
            // Track page load performance
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    event_category: 'Performance',
                    event_label: 'Portfolio Load',
                    value: totalLoadTime
                });
            }
        }, 1000);
    });

    console.log('Performance monitoring initialized');
};

// ===== ERROR TRACKING =====
const initErrorTracking = () => {
    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                event_category: 'Error',
                event_label: event.error?.message || 'Unknown error',
                description: event.error?.stack || event.message,
                fatal: false
            });
        }
        
        if (typeof window.plausible !== 'undefined') {
            window.plausible('JavaScript Error', {
                props: {
                    error: event.error?.message || 'Unknown error',
                    url: window.location.href
                }
            });
        }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                event_category: 'Error',
                event_label: 'Unhandled Promise Rejection',
                description: event.reason?.toString() || 'Unknown rejection',
                fatal: false
            });
        }
    });

    console.log('Error tracking initialized');
};

// ===== UTILITY FUNCTIONS =====
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize analytics (choose one or both)
    initGoogleAnalytics();
    // initPlausibleAnalytics(); // Uncomment if using Plausible
    
    // Initialize monitoring
    initPerformanceMonitoring();
    initErrorTracking();
    
    console.log('Analytics setup completed');
});

// ===== EXPORT FOR USE IN MAIN SCRIPT =====
window.PortfolioAnalytics = {
    trackEvent: (eventName, parameters = {}) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, parameters);
        }
        
        if (typeof window.plausible !== 'undefined') {
            window.plausible(eventName, { props: parameters });
        }
    }
};
