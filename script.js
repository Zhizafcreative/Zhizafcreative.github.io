// Main Application Module
class EduAIApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupFormHandling();
        this.setupSmoothScrolling();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Button events
        const startAccessBtn = document.getElementById('start-access');
        const watchVideoBtn = document.getElementById('watch-video');

        if (startAccessBtn) {
            startAccessBtn.addEventListener('click', this.handleStartAccess.bind(this));
        }
        
        if (watchVideoBtn) {
            watchVideoBtn.addEventListener('click', this.handleWatchVideo.bind(this));
        }
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Add scroll effect to navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Highlight active nav link based on scroll position
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        this.scrollToElement(targetElement);
                    }
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupFormHandling() {
        const accessForm = document.getElementById('access-form');

        if (accessForm) {
            accessForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    setupSmoothScrolling() {
        // Already handled in CSS with scroll-behavior: smooth
        // This is for additional JavaScript-based smooth scrolling if needed
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => {
            this.observer.observe(el);
        });
    }

    initializeAnimations() {
        // Add animation classes to elements
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        const benefitItems = document.querySelectorAll('.benefit-item');
        benefitItems.forEach((item, index) => {
            item.classList.add('slide-in-left');
            item.style.transitionDelay = `${index * 0.2}s`;
        });

        // Chart animation
        const chartBars = document.querySelectorAll('.bar');
        chartBars.forEach(bar => {
            const parentBar = bar.closest('.chart-bar');
            const value = parentBar.getAttribute('data-value');
            if (value) {
                bar.style.setProperty('--final-height', `${value}%`);
            }
        });
    }

    handleScroll() {
        // Throttle scroll events for better performance
        if (!this.scrollTimeout) {
            this.scrollTimeout = setTimeout(() => {
                this.updateScrollProgress();
                this.scrollTimeout = null;
            }, 16); // ~60fps
        }
    }

    handleResize() {
        // Handle window resize events
        this.updateLayout();
    }

    handleLoad() {
        // Handle page load events
        this.initializeAnimations();
    }

    handleStartAccess(e) {
        e.preventDefault();

        // Scroll to access form
        const accessSection = document.getElementById('akses');
        if (accessSection) {
            this.scrollToElement(accessSection);
        }

        // Focus on email input
        setTimeout(() => {
            const emailInput = document.querySelector('.form-input[type="email"]');
            if (emailInput) {
                emailInput.focus();
            }
        }, 500);
    }

    handleWatchVideo(e) {
        e.preventDefault();

        // Create modal for guide (placeholder)
        this.showGuideModal();
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        
        if (this.validateEmail(email)) {
            this.submitAccessRequest(email);
        } else {
            this.showError('Mohon masukkan email mahasiswa yang valid');
        }
    }

    scrollToElement(element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    updateScrollProgress() {
        const scrolled = window.pageYOffset;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        
        // Update any progress indicators if needed
        document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    }

    updateLayout() {
        // Handle responsive layout updates
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitAccessRequest(email) {
        try {
            // Show loading state
            this.showLoading();

            // Simulate API call (replace with actual endpoint)
            await this.simulateAPICall(email);

            // Show success message
            this.showSuccess('Pendaftaran berhasil! Selamat datang di mata kuliah Digital Marketing dengan AI.');

            // Reset form
            const form = document.getElementById('access-form');
            if (form) {
                form.reset();
            }

        } catch (error) {
            this.showError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            this.hideLoading();
        }
    }

    simulateAPICall(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Access request for: ${email}`);
                resolve();
            }, 1500);
        });
    }

    showGuideModal() {
        // Create and show guide modal (placeholder)
        const modal = document.createElement('div');
        modal.className = 'guide-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Demo Digital Marketing dengan AI</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="guide-placeholder">
                        <div class="guide-icon">🎬</div>
                        <p>Demo interaktif mata kuliah Digital Marketing!</p>
                        <p>Lihat bagaimana AI membantu dalam campaign strategy, content creation, dan analytics.</p>
                        <div style="margin-top: 20px;">
                            <button style="background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                                Mulai Demo Interaktif
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        const modalStyles = `
            .guide-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80%;
                overflow: hidden;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
            }
            .guide-placeholder {
                padding: 60px 20px;
                text-align: center;
                color: #6b7280;
            }
            .guide-icon {
                font-size: 48px;
                margin-bottom: 16px;
                color: #6366f1;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
        
        // Close modal events
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(styleSheet);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(styleSheet);
            }
        });
    }

    showLoading() {
        const submitBtn = document.querySelector('.cta-form .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Mengirim... <span class="btn-icon">⏳</span>';
        }
    }

    hideLoading() {
        const submitBtn = document.querySelector('.cta-form .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Mulai Belajar <span class="btn-icon">→</span>';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const styles = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            }
            .notification-success { background: #10b981; }
            .notification-error { background: #ef4444; }
            .notification-info { background: #6366f1; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EduAIApp();
});

// Export for potential module usage
export default EduAIApp;
