// ===== OPTIMIZED PORTFOLIO JAVASCRIPT =====
"use strict";

// ===== PERFORMANCE OPTIMIZATIONS =====
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

const debounce = (func, delay) => {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
};

// ===== LAZY LOADING WITH INTERSECTION OBSERVER =====
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
};

// ===== PERFORMANCE MONITORING =====
const performanceObserver = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
                if (entry.entryType === 'first-input') {
                    console.log('FID:', entry.processingStart - entry.startTime);
                }
                if (entry.entryType === 'layout-shift') {
                    console.log('CLS:', entry.value);
                }
            });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
};

// ===== ADVANCED NAVBAR FUNCTIONALITY =====
const initNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navbar-toggle');
    const navLinks = document.getElementById('navbar-links');
    const navItems = document.querySelectorAll('.navbar-links a');

    // Smooth scroll with offset for fixed navbar
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('href');
            smoothScroll(target);
            
            // Close mobile menu
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Navbar scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 16);

    window.addEventListener('scroll', handleScroll);
};

// ===== ENHANCED TYPING ANIMATION =====
const initTypingAnimation = () => {
    const textElement = document.getElementById('typed-text');
    if (!textElement) return;

    const texts = [
        "Cloud & DevOps Engineer",
        "Python Developer",
        "AWS Enthusiast",
        "Full-Stack Developer",
        "Problem Solver"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    };

    type();
};

// ===== ADVANCED CODE SHOWCASE =====
const initCodeShowcase = () => {
    const tabs = document.querySelectorAll('.code-tab');
    const codeContent = document.getElementById('animated-code');
    const codeFilename = document.getElementById('code-filename');
    const outputContent = document.getElementById('output-content');

    if (!codeContent || !tabs.length) return;

    const codeExamples = {
        python: {
            filename: 'main.py',
            code: `def analyze_sentence(sentence):
    """Analyze sentence and return character statistics"""
    vowels = 'aeiouAEIOU'
    consonants = 'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'
    
    stats = {
        'vowels': sum(1 for char in sentence if char in vowels),
        'consonants': sum(1 for char in sentence if char in consonants),
        'digits': sum(1 for char in sentence if char.isdigit()),
        'spaces': sentence.count(' '),
        'special': len(sentence) - sum([
            sum(1 for char in sentence if char in vowels),
            sum(1 for char in sentence if char in consonants),
            sum(1 for char in sentence if char.isdigit()),
            sentence.count(' ')
        ])
    }
    return stats

# Usage
sentence = "Hello, World! 123"
result = analyze_sentence(sentence)
print(f"Analysis: {result}")`,
            output: `Analysis: {'vowels': 3, 'consonants': 7, 'digits': 3, 'spaces': 1, 'special': 2}`
        },
        javascript: {
            filename: 'app.js',
            code: `// Modern JavaScript with async/await
class PortfolioManager {
    constructor() {
        this.projects = [];
        this.skills = new Map();
    }
    
    async loadProjects() {
        try {
            const response = await fetch('/api/projects');
            this.projects = await response.json();
            return this.projects;
        } catch (error) {
            console.error('Failed to load projects:', error);
            throw error;
        }
    }
    
    addSkill(category, technologies) {
        this.skills.set(category, technologies);
    }
    
    getSkillsByCategory(category) {
        return this.skills.get(category) || [];
    }
}

// Usage
const portfolio = new PortfolioManager();
portfolio.addSkill('Cloud', ['AWS', 'Docker', 'Kubernetes']);
console.log(portfolio.getSkillsByCategory('Cloud'));`,
            output: `['AWS', 'Docker', 'Kubernetes']`
        },
        docker: {
            filename: 'Dockerfile',
            code: `# Multi-stage Docker build for optimal image size
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]`,
            output: `Docker image built successfully: portfolio-app:latest`
        },
        aws: {
            filename: 'deploy.sh',
            code: `#!/bin/bash
# AWS deployment script for portfolio

# Configuration
REGION="us-east-1"
BUCKET_NAME="vivek-portfolio-assets"
DISTRIBUTION_ID="E1234567890ABC"

echo "🚀 Starting deployment..."

# Build the project
npm run build

# Upload to S3
echo "📦 Uploading to S3..."
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \\
    --distribution-id $DISTRIBUTION_ID \\
    --paths "/*"

# Deploy to EC2 (if applicable)
if [ "$DEPLOY_TO_EC2" = "true" ]; then
    echo "🖥️ Deploying to EC2..."
    ssh -i ~/.ssh/portfolio-key.pem ubuntu@$EC2_IP \\
        "cd /var/www/portfolio && git pull && npm run build"
fi

echo "✅ Deployment completed successfully!"`,
            output: `🚀 Starting deployment...
📦 Uploading to S3...
🔄 Invalidating CloudFront cache...
✅ Deployment completed successfully!`
        }
    };

    let currentLang = 'python';
    let typeIndex = 0;

    const typeCode = () => {
        const example = codeExamples[currentLang];
        if (!example) return;

        const code = example.code;
        if (typeIndex < code.length) {
            codeContent.textContent = code.substring(0, typeIndex + 1);
            typeIndex++;
            setTimeout(typeCode, 20);
        } else {
            // Show output after typing is complete
            setTimeout(() => {
                outputContent.textContent = example.output;
            }, 500);
        }
    };

    const switchLanguage = (lang) => {
        currentLang = lang;
        typeIndex = 0;
        codeContent.textContent = '';
        outputContent.textContent = '';
        
        const example = codeExamples[lang];
        if (example) {
            codeFilename.textContent = example.filename;
            typeCode();
        }
    };

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            switchLanguage(tab.dataset.lang);
        });
    });

    // Start with Python
    switchLanguage('python');
};

// ===== ENHANCED TERMINAL SIMULATION =====
const initTerminal = () => {
    const terminalBody = document.getElementById('terminal-body');
    const commandElement = document.getElementById('terminal-command');
    const outputElement = document.getElementById('terminal-output');

    if (!terminalBody || !commandElement) return;

    const commands = [
        { cmd: 'ls -la', output: 'drwxr-xr-x  5 vivek vivek 4096 Jan 20 10:30 .\ndrwxr-xr-x  3 vivek vivek 4096 Jan 15 09:15 ..\n-rw-r--r--  1 vivek vivek 1250 Jan 20 10:25 Dockerfile\n-rw-r--r--  1 vivek vivek  890 Jan 20 10:20 package.json\n-rw-r--r--  1 vivek vivek 2150 Jan 20 10:15 app.py\n-rw-r--r--  1 vivek vivek  450 Jan 20 10:10 README.md' },
        { cmd: 'docker build -t portfolio-app .', output: 'Sending build context to Docker daemon  2.048kB\nStep 1/8 : FROM node:18-alpine\n ---> a1b2c3d4e5f6\nStep 2/8 : WORKDIR /app\n ---> Running in 1a2b3c4d5e6f\nRemoving intermediate container 1a2b3c4d5e6f\n ---> 7f8e9d0c1b2a\n...\nSuccessfully built 8a9b0c1d2e3f\nSuccessfully tagged portfolio-app:latest' },
        { cmd: 'kubectl get pods', output: 'NAME                          READY   STATUS    RESTARTS   AGE\nportfolio-deployment-7d4f8b6c9-abc12   1/1     Running   0          2d\nportfolio-deployment-7d4f8b6c9-def34   1/1     Running   0          2d\nnginx-ingress-controller-xyz789        1/1     Running   0          5d' },
        { cmd: 'aws s3 ls s3://vivek-portfolio-assets/', output: '2025-01-20 10:30:15    1.2 MB index.html\n2025-01-20 10:30:15    2.1 MB style.css\n2025-01-20 10:30:15    856 KB script.js\n2025-01-20 10:30:15    245 KB vs-img.png\n2025-01-20 10:30:15    156 KB manifest.json' },
        { cmd: 'python app.py', output: 'Starting portfolio application...\nServer running on http://localhost:3000\nDatabase connected successfully\nCache initialized\nReady to serve requests!' }
    ];

    let commandIndex = 0;
    let currentCommand = '';
    let isTyping = false;

    const typeCommand = () => {
        const cmd = commands[commandIndex];
        if (!cmd) {
            commandIndex = 0;
            setTimeout(typeCommand, 2000);
            return;
        }

        const fullCommand = cmd.cmd;
        if (currentCommand.length < fullCommand.length) {
            currentCommand += fullCommand[currentCommand.length];
            commandElement.textContent = currentCommand;
            setTimeout(typeCommand, 100);
        } else {
            setTimeout(() => {
                outputElement.innerHTML = `<div class="terminal-output-line">${cmd.output.replace(/\n/g, '</div><div class="terminal-output-line">')}</div>`;
                currentCommand = '';
                commandElement.textContent = '';
                commandIndex++;
                setTimeout(typeCommand, 3000);
            }, 1000);
        }
    };

    // Start typing after a delay
    setTimeout(typeCommand, 2000);
};

// ===== ENHANCED FORM HANDLING =====
const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form) return;

    const showStatus = (message, type = 'success') => {
        status.textContent = message;
        status.className = `form-status ${type}`;
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showStatus('Please fill in all required fields.', 'error');
            return;
        }

        if (data.message.length < 10) {
            showStatus('Message must be at least 10 characters long.', 'error');
            return;
        }

        try {
            showStatus('Sending message...', 'info');
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showStatus('Failed to send message. Please try again or contact me directly.', 'error');
        }
    });
};

// ===== SCROLL TO TOP FUNCTIONALITY =====
const initScrollToTop = () => {
    const scrollBtn = document.getElementById('scrollTop');
    
    if (!scrollBtn) return;

    const handleScroll = throttle(() => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, 16);

    window.addEventListener('scroll', handleScroll);

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ===== ACCESSIBILITY ENHANCEMENTS =====
const initAccessibility = () => {
    // Keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Focus management for mobile menu
    const navToggle = document.getElementById('navbar-toggle');
    const navLinks = document.getElementById('navbar-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            setTimeout(() => {
                if (navLinks.classList.contains('active')) {
                    const firstLink = navLinks.querySelector('a');
                    if (firstLink) firstLink.focus();
                }
            }, 100);
        });
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        setTimeout(() => {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 300);
        }, 1000);
    }

    // Initialize all features
    initNavbar();
    initTypingAnimation();
    initCodeShowcase();
    initTerminal();
    initContactForm();
    initScrollToTop();
    initAccessibility();
    lazyLoadImages();
    performanceObserver();

    // Announce page load to screen readers
    const srAnnouncements = document.getElementById('sr-announcements');
    if (srAnnouncements) {
        srAnnouncements.textContent = 'Portfolio page loaded successfully';
    }
});

// ===== SERVICE WORKER REGISTRATION =====
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
