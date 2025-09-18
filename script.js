// ===== MODERN PORTFOLIO JAVASCRIPT =====

"use strict";

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

const debounce = (func, delay) => {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
};

// ===== NAVBAR FUNCTIONALITY =====
(function() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navbar-toggle');
    const navLinks = document.getElementById('navbar-links');
    const navItems = document.querySelectorAll('.navbar-links a');

    // Navbar scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
})();

// ===== SCROLL TO TOP BUTTON =====
(function() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        const toggleScrollTop = throttle(() => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, 100);

        window.addEventListener('scroll', toggleScrollTop, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
})();

// ===== TYPED TEXT ANIMATION =====
(function() {
    const roles = [
        "Final-year BCA Student",
        "Future MCA Graduate",
        "Web Developer",
        "Python Enthusiast",
        "Aspiring DevOps Engineer",
        "Cloud Computing Learner"
    ];

    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;
    let deleteSpeed = 50;
    let pauseTime = 2000;

    function typeText() {
        const typedTextElement = document.getElementById('typed-text');
        if (!typedTextElement) return;

        const currentRole = roles[currentRoleIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typeSpeed = deleteSpeed;
        } else {
            typedTextElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    // Start typing animation when page loads
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(typeText, 1000);
    });
})();

// ===== SCROLL ANIMATIONS =====
(function() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.about-card, .project-card, .tech-item, .contact-form, .contact-info');
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    };

    document.addEventListener('DOMContentLoaded', animateOnScroll);
})();

// ===== CONTACT FORM SUBMISSION =====
(function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const statusDiv = document.getElementById('form-status');

    if (contactForm && submitBtn && statusDiv) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            statusDiv.textContent = '';
            statusDiv.className = 'form-status';

            try {
                const formData = new FormData(contactForm);
                
                // Add timeout to prevent hanging requests
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        statusDiv.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                        statusDiv.className = 'form-status success';
                        contactForm.reset();
                    } else {
                        throw new Error(result.message || 'Failed to send message');
                    }
                } else {
                    throw new Error('Network error occurred');
                }
            } catch (error) {
                const errorMessage = error.name === 'AbortError' 
                    ? 'Request timed out. Please try again.' 
                    : `❌ ${error.message}`;
                
                statusDiv.textContent = errorMessage;
                statusDiv.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        });
    }
})();

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
(function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
})();

// ===== HERO SECTION (STATIC - NO PARALLAX) =====
// Hero portrait is intentionally static per requirements
// No scroll/hover transforms applied to maintain professional appearance

// ===== TECH ITEM HOVER EFFECTS =====
(function() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
})();

// ===== PROJECT CARD HOVER EFFECTS =====
(function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
})();

// ===== PERFORMANCE OPTIMIZATIONS =====
(function() {
    // Lazy load images
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

    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
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

// ===== ACCESSIBILITY IMPROVEMENTS =====
(function() {
    // Keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const navLinks = document.getElementById('navbar-links');
            const navToggle = document.getElementById('navbar-toggle');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
        }
    });

    // Focus management for better accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusable = Array.from(document.querySelectorAll(focusableElements));
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    });
})();

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== ANIMATED CODE SHOWCASE =====
(function() {
    const codeExamples = {
        python: {
            filename: 'cloud_deploy.py',
            code: `<span class="comment"># AWS Lambda deployment script</span>
<span class="keyword">import</span> boto3
<span class="keyword">import</span> json

<span class="keyword">def</span> <span class="function">deploy_to_aws</span>():
    <span class="variable">lambda_client</span> = boto3.client(<span class="string">'lambda'</span>)
    
    <span class="keyword">with</span> open(<span class="string">'function.zip'</span>, <span class="string">'rb'</span>) <span class="keyword">as</span> f:
        <span class="variable">zip_content</span> = f.read()
    
    <span class="variable">response</span> = lambda_client.update_function_code(
        FunctionName=<span class="string">'my-function'</span>,
        ZipFile=<span class="variable">zip_content</span>
    )
    
    <span class="keyword">return</span> response[<span class="string">'FunctionArn'</span>]

<span class="comment"># Deploy the function</span>
<span class="variable">arn</span> = <span class="function">deploy_to_aws</span>()
<span class="function">print</span>(<span class="string">f"Deployed: {arn}"</span>)`,
            output: `✅ Function deployed successfully!
ARN: arn:aws:lambda:us-east-1:123456789012:function:my-function
Status: Active
Runtime: python3.9`
        },
        javascript: {
            filename: 'api_handler.js',
            code: `<span class="comment">// Express.js API with MongoDB</span>
<span class="keyword">const</span> <span class="variable">express</span> = <span class="function">require</span>(<span class="string">'express'</span>);
<span class="keyword">const</span> <span class="variable">mongoose</span> = <span class="function">require</span>(<span class="string">'mongoose'</span>);

<span class="keyword">const</span> <span class="variable">app</span> = <span class="function">express</span>();

<span class="comment">// Connect to MongoDB</span>
mongoose.<span class="function">connect</span>(<span class="string">'mongodb://localhost:27017/portfolio'</span>);

<span class="comment">// API Route</span>
app.<span class="function">get</span>(<span class="string">'/api/projects'</span>, <span class="keyword">async</span> (req, res) => {
  <span class="keyword">try</span> {
    <span class="keyword">const</span> <span class="variable">projects</span> = <span class="keyword">await</span> Project.<span class="function">find</span>();
    res.<span class="function">json</span>({ 
      <span class="variable">success</span>: <span class="keyword">true</span>, 
      <span class="variable">data</span>: projects 
    });
  } <span class="keyword">catch</span> (error) {
    res.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({ <span class="variable">error</span>: error.message });
  }
});

app.<span class="function">listen</span>(<span class="number">3000</span>, () => {
  console.<span class="function">log</span>(<span class="string">'Server running on port 3000'</span>);
});`,
            output: `🚀 Server started successfully!
Connected to MongoDB
✅ Database connection established
🌐 API endpoint active: http://localhost:3000/api/projects
Server running on port 3000`
        },
        docker: {
            filename: 'Dockerfile',
            code: `<span class="comment"># Multi-stage Docker build</span>
<span class="keyword">FROM</span> node:<span class="number">18</span>-alpine <span class="keyword">AS</span> builder

<span class="keyword">WORKDIR</span> /app
<span class="keyword">COPY</span> package*.json ./
<span class="keyword">RUN</span> npm ci --only=production

<span class="comment"># Production stage</span>
<span class="keyword">FROM</span> node:<span class="number">18</span>-alpine

<span class="keyword">RUN</span> addgroup -g <span class="number">1001</span> -S nodejs
<span class="keyword">RUN</span> adduser -S nextjs -u <span class="number">1001</span>

<span class="keyword">WORKDIR</span> /app
<span class="keyword">COPY</span> --from=builder /app/node_modules ./node_modules
<span class="keyword">COPY</span> --chown=nextjs:nodejs . .

<span class="keyword">USER</span> nextjs

<span class="keyword">EXPOSE</span> <span class="number">3000</span>

<span class="keyword">CMD</span> [<span class="string">"npm"</span>, <span class="string">"start"</span>]`,
            output: `🐳 Building Docker image...
Step 1/10 : FROM node:18-alpine AS builder
 ---> a1b2c3d4e5f6
Step 2/10 : WORKDIR /app
 ---> Running in 1234567890ab
Successfully built image: portfolio:latest
✅ Container ready for deployment!`
        },
        aws: {
            filename: 'deploy.sh',
            code: `<span class="comment"># AWS CLI deployment script</span>
<span class="keyword">#!/bin/bash</span>

<span class="comment"># Create S3 bucket for static hosting</span>
aws s3 mb s3://vivek-portfolio-bucket

<span class="comment"># Enable static website hosting</span>
aws s3 website s3://vivek-portfolio-bucket \\
  --index-document index.html \\
  --error-document error.html

<span class="comment"># Upload files</span>
aws s3 sync ./dist s3://vivek-portfolio-bucket

<span class="comment"># Create CloudFront distribution</span>
aws cloudfront create-distribution \\
  --distribution-config file://cloudfront-config.json

<span class="function">echo</span> <span class="string">"✅ Portfolio deployed to AWS!"</span>`,
            output: `🚀 Deploying to AWS...
✅ S3 bucket created: vivek-portfolio-bucket
✅ Static hosting enabled
📁 Uploading files... (15 files uploaded)
☁️  CloudFront distribution created
🌐 Domain: d1234567890.cloudfront.net
✅ Portfolio deployed successfully!`
        }
    };

    let currentLang = 'python';
    let typewriterTimeout;

    function typeWriter(text, element, speed = 50) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                typewriterTimeout = setTimeout(type, speed);
            } else {
                // Add blinking cursor at the end
                element.innerHTML += '<span class="typing-cursor"></span>';
            }
        }
        
        type();
    }

    function switchCodeExample(lang) {
        if (!codeExamples[lang] || lang === currentLang) return;
        
        currentLang = lang;
        const example = codeExamples[lang];
        
        // Clear any existing typewriter
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
        }
        
        // Update filename
        document.getElementById('code-filename').textContent = example.filename;
        
        // Update tabs
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.lang === lang) {
                tab.classList.add('active');
            }
        });
        
        // Clear and start typing animation
        const codeElement = document.getElementById('animated-code');
        const outputElement = document.getElementById('output-content');
        
        codeElement.innerHTML = '';
        outputElement.innerHTML = '';
        
        // Type the code
        typeWriter(example.code, codeElement, 30);
        
        // Show output after code is done typing
        setTimeout(() => {
            typeWriter(example.output, outputElement, 40);
        }, example.code.length * 30 + 500);
    }

    function initCodeShowcase() {
        // Add click handlers to tabs
        document.querySelectorAll('.code-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchCodeExample(tab.dataset.lang);
            });
        });

        // Start with Python example
        setTimeout(() => {
            switchCodeExample('python');
        }, 1000);

        // Auto-rotate through examples every 15 seconds
        setInterval(() => {
            const languages = Object.keys(codeExamples);
            const currentIndex = languages.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % languages.length;
            switchCodeExample(languages[nextIndex]);
        }, 15000);
    }

    // Listen for mobile auto-start event
    document.getElementById('code-showcase')?.addEventListener('startCodeAnimation', initCodeShowcase);
    
    document.addEventListener('DOMContentLoaded', initCodeShowcase);
})();

// ===== TERMINAL SIMULATION =====
(function() {
    const terminalCommands = [
        {
            command: 'git status',
            output: `<span class="info">On branch main</span>
<span class="info">Your branch is up to date with 'origin/main'.</span>

<span class="success">nothing to commit, working tree clean</span>`
        },
        {
            command: 'docker ps',
            output: `<span class="info">CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                    NAMES</span>
<span class="success">a1b2c3d4e5f6   portfolio:latest        "npm start"              2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp   portfolio-app</span>
<span class="success">f6e5d4c3b2a1   nginx:alpine            "/docker-entrypoint.…"   5 minutes ago   Up 5 minutes   0.0.0.0:80->80/tcp       nginx-proxy</span>`
        },
        {
            command: 'aws s3 ls s3://my-portfolio-bucket',
            output: `<span class="info">2025-01-15 10:30:22       2048 index.html</span>
<span class="info">2025-01-15 10:30:23       5632 style.css</span>
<span class="info">2025-01-15 10:30:24       3421 script.js</span>
<span class="info">2025-01-15 10:30:25     102400 vs-img.png</span>
<span class="success">✅ Portfolio files synced successfully!</span>`
        },
        {
            command: 'kubectl get pods',
            output: `<span class="info">NAME                                READY   STATUS    RESTARTS   AGE</span>
<span class="success">portfolio-deployment-7d4b8c9f-x2k5m   1/1     Running   0          5m</span>
<span class="success">portfolio-deployment-7d4b8c9f-y3l6n   1/1     Running   0          5m</span>
<span class="success">portfolio-deployment-7d4b8c9f-z4m7o   1/1     Running   0          5m</span>`
        },
        {
            command: 'python manage.py runserver',
            output: `<span class="info">Watching for file changes with StatReloader</span>
<span class="info">Performing system checks...</span>

<span class="success">System check identified no issues (0 silenced).</span>
<span class="info">January 15, 2025 - 10:30:00</span>
<span class="success">Django version 4.2.0, using settings 'myproject.settings'</span>
<span class="success">Starting development server at http://127.0.0.1:8000/</span>
<span class="info">Quit the server with CONTROL-C.</span>`
        },
        {
            command: 'npm run build',
            output: `<span class="info">> portfolio@1.0.0 build</span>
<span class="info">> react-scripts build</span>

<span class="info">Creating an optimized production build...</span>
<span class="success">Compiled successfully.</span>

<span class="info">File sizes after gzip:</span>
<span class="info">  45.2 kB  build/static/js/main.8f4b2c1d.js</span>
<span class="info">  2.1 kB   build/static/css/main.f9c3d2e1.css</span>

<span class="success">✅ Build completed successfully!</span>`
        }
    ];

    let currentCommandIndex = 0;
    let isTyping = false;

    function typeCommand(command, callback) {
        if (isTyping) return;
        
        isTyping = true;
        const commandElement = document.getElementById('terminal-command');
        const cursor = document.querySelector('.terminal-cursor');
        
        commandElement.textContent = '';
        cursor.style.display = 'inline';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < command.length) {
                commandElement.textContent += command.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                cursor.style.display = 'none';
                setTimeout(() => {
                    callback();
                }, 500);
            }
        }, 80);
    }

    function showOutput(output) {
        const outputElement = document.getElementById('terminal-output');
        outputElement.innerHTML = output;
        
        // After showing output, prepare for next command
        setTimeout(() => {
            prepareNextCommand();
        }, 3000);
    }

    function prepareNextCommand() {
        const terminalBody = document.getElementById('terminal-body');
        const commandElement = document.getElementById('terminal-command');
        const cursor = document.querySelector('.terminal-cursor');
        
        // Clear previous command and output
        commandElement.textContent = '';
        document.getElementById('terminal-output').innerHTML = '';
        cursor.style.display = 'inline';
        
        // Move to next command
        currentCommandIndex = (currentCommandIndex + 1) % terminalCommands.length;
        isTyping = false;
        
        // Start next command after a pause
        setTimeout(() => {
            executeCommand();
        }, 1000);
    }

    function executeCommand() {
        const currentCommand = terminalCommands[currentCommandIndex];
        
        typeCommand(currentCommand.command, () => {
            showOutput(currentCommand.output);
        });
    }

    function initTerminal() {
        // Start the terminal simulation
        setTimeout(() => {
            executeCommand();
        }, 2000);
    }

    // Initialize when the terminal section is visible
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initTerminal();
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Listen for mobile auto-start event
    document.getElementById('terminal')?.addEventListener('startTerminalAnimation', initTerminal);
    
    document.addEventListener('DOMContentLoaded', () => {
        const terminalSection = document.getElementById('terminal');
        if (terminalSection) {
            terminalObserver.observe(terminalSection);
        }
    });
})();

// ===== MOBILE DETECTION AND OPTIMIZATION =====
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
};

const isVerySmallScreen = () => {
    return window.innerWidth <= 480;
};

// ===== MOBILE-OPTIMIZED ANIMATIONS =====
(function() {
    let userHasInteracted = false;
    
    // Track user interaction for vibration API
    function enableUserInteraction() {
        userHasInteracted = true;
        console.log('🎯 User interaction detected - haptic feedback enabled');
        
        // Remove listeners after first interaction
        document.removeEventListener('touchstart', enableUserInteraction);
        document.removeEventListener('click', enableUserInteraction);
    }
    
    // Add interaction listeners
    document.addEventListener('touchstart', enableUserInteraction, { once: true });
    document.addEventListener('click', enableUserInteraction, { once: true });
    
    function optimizeForMobile() {
        if (isMobile()) {
            // Add mobile class for CSS targeting
            document.body.classList.add('mobile-device');
            
            // Reduce typewriter speed on mobile for better performance
            const originalTypewriter = window.typeWriter;
            if (originalTypewriter) {
                window.typeWriter = function(text, element, speed = 80) {
                    return originalTypewriter.call(this, text, element, speed);
                };
            }
            
            // Optimize intersection observers for mobile
            const originalObserver = window.IntersectionObserver;
            window.IntersectionObserver = function(callback, options = {}) {
                const mobileOptions = {
                    ...options,
                    rootMargin: '20px',
                    threshold: isVerySmallScreen() ? 0.1 : 0.2
                };
                return new originalObserver(callback, mobileOptions);
            };
        }
    }
    
    // Safe vibration function
    window.safeVibrate = function(duration = 10) {
        if (userHasInteracted && navigator.vibrate && isMobile()) {
            try {
                navigator.vibrate(duration);
            } catch (e) {
                console.log('Vibration not supported or blocked');
            }
        }
    };
    
    // Auto-start animations when sections come into view (mobile-friendly)
    function initMobileAnimations() {
        // Code showcase auto-start
        const codeSection = document.getElementById('code-showcase');
        if (codeSection) {
            const codeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animated');
                        // Delay for mobile performance
                        setTimeout(() => {
                            const event = new CustomEvent('startCodeAnimation');
                            codeSection.dispatchEvent(event);
                        }, isMobile() ? 1000 : 500);
                        codeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: isMobile() ? 0.2 : 0.3 });
            
            codeObserver.observe(codeSection);
        }
        
        // Terminal auto-start
        const terminalSection = document.getElementById('terminal');
        if (terminalSection) {
            const terminalObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animated');
                        setTimeout(() => {
                            const event = new CustomEvent('startTerminalAnimation');
                            terminalSection.dispatchEvent(event);
                        }, isMobile() ? 1500 : 1000);
                        terminalObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: isMobile() ? 0.3 : 0.5 });
            
            terminalObserver.observe(terminalSection);
        }
        
        // Skills section animations
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                        entry.target.classList.add('animated');
                        // Add mobile-friendly touch effects for cloud services
                        const cloudServices = entry.target.querySelectorAll('.cloud-service');
                        cloudServices.forEach((service, index) => {
                            // Add staggered animation delay for mobile
                            service.style.animationDelay = `${index * 0.3}s`;
                            
                            // Touch events for mobile
                            service.addEventListener('touchstart', (e) => {
                                e.preventDefault();
                                service.style.transform = 'scale(1.08)';
                                service.style.background = 'rgba(59, 130, 246, 0.2)';
                                service.style.borderColor = '#3b82f6';
                                
                                // Add haptic feedback if available
                                window.safeVibrate(10);
                            });
                            
                            service.addEventListener('touchend', () => {
                                setTimeout(() => {
                                    service.style.transform = 'scale(1)';
                                    service.style.background = 'rgba(255, 255, 255, 0.05)';
                                    service.style.borderColor = 'var(--border)';
                                }, 150);
                            });
                            
                            // Add click event for mobile interaction
                            service.addEventListener('click', () => {
                                const serviceName = service.dataset.service;
                                console.log(`🔵 ${serviceName.toUpperCase()} service activated on mobile!`);
                            });
                        });
                        skillsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: isMobile() ? 0.1 : 0.2 });
            
            skillsObserver.observe(skillsSection);
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        optimizeForMobile();
        initMobileAnimations();
    });
})();

// ===== PERFORMANCE MONITORING =====
(function() {
    function monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    if (isMobile()) {
                        console.log(`📱 Mobile load time: ${loadTime}ms`);
                        if (loadTime > 4000) {
                            console.warn('Mobile performance could be improved');
                        }
                    } else {
                        console.log(`💻 Desktop load time: ${loadTime}ms`);
                    }
                }, 100);
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', monitorPerformance);
})();

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
    
    // Initialize any other components here
    console.log('Portfolio website loaded successfully! 🚀');
});