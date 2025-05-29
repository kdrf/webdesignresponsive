// DOM Elements
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');
const langButtons = document.querySelectorAll('.lang-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const htmlElement = document.documentElement;

// State
let isNavOpen = false;
let lastScroll = 0;
const scrollThreshold = 5;

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 50,
    disable: 'mobile'
});

// Typed.js Initialization
function initTyped() {
    if (window.typed) {
        window.typed.destroy();
    }
    const roles = getText('hero.roles');
    window.typed = new Typed('#typed-text', {
        strings: roles,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true,
        smartBackspace: true
    });
}

// Navigation Functions
function toggleNav() {
    isNavOpen = !isNavOpen;
    hamburger.classList.toggle('active', isNavOpen);
    nav.classList.toggle('active', isNavOpen);
    document.body.style.overflow = isNavOpen ? 'hidden' : '';
}

function closeNav() {
    if (isNavOpen) {
        isNavOpen = false;
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Theme Functions
const root = document.documentElement;

function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Form Validation
function validateForm(data) {
    let isValid = true;
    const fields = ['name', 'email', 'message'];
    
    fields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        document.getElementById('email').classList.add('error');
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    emailjs.init("YOUR_USER_ID");

    // Initialize Typed.js
    initTyped();
    
    // Initialize language
    updateContent();
    const currentLang = localStorage.getItem('selectedLanguage') || defaultLang;
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Header scroll behavior
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class for background
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const body = document.body;

    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        body.classList.toggle('nav-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('nav-open');
        }
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('nav-open');
        });
    });

    // Back to Top Button
    const backToTop = document.querySelector('#back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));

    // Smooth Scroll for Anchor Links
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

    // Initialize Swiper
    const testimonialSwiper = new Swiper('.testimonials-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            }
        }
    });

    // Form Validation and Submission
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
                
                // Initialize EmailJS
                await emailjs.init("YOUR_USER_ID");
                
                await emailjs.sendForm(
                    'YOUR_SERVICE_ID',
                    'YOUR_TEMPLATE_ID',
                    contactForm
                );
                
                alert(getText('contact.success'));
                contactForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert(getText('contact.error'));
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = getText('contact.form.send');
            }
        });
    }

    // Language Selector
    const langToggle = document.querySelector('.language-toggle');
    const langMenu = document.querySelector('.language-menu');

    if (langToggle && langMenu) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = langToggle.getAttribute('aria-expanded') === 'true';
            
            langToggle.setAttribute('aria-expanded', !isExpanded);
            langMenu.classList.toggle('active');
            
            // Update aria-expanded and handle animation
            if (!isExpanded) {
                langMenu.style.display = 'block';
                requestAnimationFrame(() => {
                    langMenu.style.opacity = '1';
                    langMenu.style.transform = 'translateY(0)';
                });
            } else {
                langMenu.style.opacity = '0';
                langMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    langMenu.style.display = 'none';
                }, 300);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            if (langMenu.classList.contains('active')) {
                langToggle.setAttribute('aria-expanded', 'false');
                langMenu.classList.remove('active');
                langMenu.style.opacity = '0';
                langMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    langMenu.style.display = 'none';
                }, 300);
            }
        });

        // Prevent menu close when clicking inside menu
        langMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Tools category filtering with smooth animations
    const categoryTabs = document.querySelectorAll('.category-tab');
    const toolCards = document.querySelectorAll('.tool-card');
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: false,
        mirror: true
    });

    function filterTools(category) {
        toolCards.forEach(card => {
            // First, remove AOS animation classes
            card.removeAttribute('data-aos');
            card.removeAttribute('data-aos-delay');
            
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                // Add fade out before showing
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.display = 'flex';
                
                // Force reflow
                void card.offsetWidth;
                
                // Add fade in
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                // Fade out before hiding
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const category = tab.dataset.category;
            filterTools(category);
            
            // Refresh AOS
            setTimeout(() => {
                AOS.refresh();
            }, 500);
        });
    });

    // Add necessary styles
    const style = document.createElement('style');
    style.textContent = `
        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 2rem;
            position: relative;
        }
        .tool-card {
            transition: opacity 0.4s ease, transform 0.4s ease;
            will-change: transform, opacity;
        }
        .tool-card[style*="visibility: hidden"] {
            pointer-events: none;
            position: absolute;
            top: 0;
            left: 0;
        }
    `;
    document.head.appendChild(style);

    // Add parallax effect if not reduced motion
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        document.addEventListener('mousemove', (e) => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                const floatingElements = document.querySelectorAll('.floating-element');
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                floatingElements.forEach((element, index) => {
                    const factor = (index + 1) * 15;
                    const translateX = (mouseX - 0.5) * factor;
                    const translateY = (mouseY - 0.5) * factor;
                    element.style.transform = `translate(${translateX}px, ${translateY}px)`;
                });
            }
        });
    }
});

// Language Switch Event Listeners
langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        langButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        setLanguage(lang);
    });
});

// Theme Toggle Event Listener
themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Scroll Event Listener
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Handle header visibility
    if (Math.abs(currentScroll - lastScroll) < scrollThreshold) return;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up', 'scroll-down');
    } else if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
    
    // Handle back to top button visibility
    if (currentScroll > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Keyboard Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeNav();
    }
});

// Add animation on scroll for project cards
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Typewriter effect
const subtitle = document.querySelector('.hero-subtitle');
const text = subtitle.textContent;
subtitle.textContent = '';
subtitle.classList.add('typewriter');

let charIndex = 0;
function typeWriter() {
    if (charIndex < text.length) {
        subtitle.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

// Start typewriter effect when hero section is in view
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        typeWriter();
        heroObserver.unobserve(entries[0].target);
    }
});

heroObserver.observe(document.querySelector('.hero'));

// Project modal functionality
const modal = document.getElementById('project-modal');
const modalClose = modal.querySelector('.modal-close');
const projectCards = document.querySelectorAll('.project-card');

// Project data with translations
const projectDetails = {
    // English projects
    'Weather App': {
        description: 'A comprehensive weather application that provides real-time weather data using the OpenWeatherMap API. Features include current conditions, hourly forecast, and 5-day predictions.',
        images: ['weather-app-1.jpg', 'weather-app-2.jpg'],
        tech: ['HTML', 'CSS', 'JavaScript', 'API Integration'],
        demo: '#',
        github: '#'
    },
    'Todo List': {
        description: 'A feature-rich todo list application with local storage persistence. Users can create, edit, and delete tasks, set priorities, and filter by status.',
        images: ['todo-1.jpg', 'todo-2.jpg'],
        tech: ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
        demo: '#',
        github: '#'
    },
    // Turkish projects
    'Hava Durumu Uygulaması': {
        description: `Türkiye'deki şehirler için gerçek zamanlı hava durumu bilgilerini gösteren kapsamlı bir uygulama.
        Özellikler:
        - Anlık hava durumu bilgisi
        - Saatlik tahminler
        - 5 günlük hava durumu tahmini
        - Sıcaklık, nem ve rüzgar detayları`,
        images: ['weather-app-1.jpg', 'weather-app-2.jpg'],
        tech: ['HTML', 'CSS', 'JavaScript', 'API Entegrasyonu'],
        demo: '#',
        github: '#'
    },
    'Yapılacaklar Listesi': {
        description: `Günlük görevlerinizi organize etmenize yardımcı olan modern bir uygulama.
        Özellikler:
        - Görev ekleme ve düzenleme
        - Öncelik belirleme
        - Kategorilere ayırma
        - Yerel depolama ile veri kaybını önleme`,
        images: ['todo-1.jpg', 'todo-2.jpg'],
        tech: ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
        demo: '#',
        github: '#'
    },
    'Sanal Market Uygulaması': {
        description: `Yerel marketler için tasarlanan kullanıcı dostu bir e-ticaret uygulaması.
        Özellikler:
        - Kolay ürün arama ve filtreleme
        - Hızlı sipariş verme süreci
        - Teslimat takibi
        - Favori ürünler listesi
        - Geçmiş siparişler`,
        images: ['ecommerce-1.jpg', 'ecommerce-2.jpg', 'ecommerce-3.jpg'],
        tech: ['Figma', 'Prototip', 'UI Tasarım', 'Kullanıcı Araştırması'],
        figmaLink: '#',
        case_study: '#'
    },
    'Türkiye Gezi Rehberi': {
        description: `Türkiye'nin kültürel ve turistik yerlerini keşfetmek için tasarlanan kapsamlı bir seyahat platformu.
        Özellikler:
        - Şehir bazlı gezi rehberleri
        - Popüler mekanlar ve etkinlikler
        - Kullanıcı yorumları ve puanlamaları
        - Özelleştirilebilir gezi planları
        - Yerel deneyimler`,
        images: ['travel-1.jpg', 'travel-2.jpg', 'travel-3.jpg'],
        tech: ['Figma', 'Kullanıcı Araştırması', 'Taslak', 'Prototip'],
        figmaLink: '#',
        case_study: '#'
    }
};

// Form messages
const formMessages = {
    en: {
        success: 'Thank you for your message! I will get back to you soon.',
        error: 'There was an error sending your message. Please try again.'
    },
    tr: {
        success: 'Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağım.',
        error: 'Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
    }
};

projectCards.forEach(card => {
    const viewDetailsBtn = card.querySelector('.view-details');
    if (!viewDetailsBtn) return;

    viewDetailsBtn.addEventListener('click', () => {
        const projectTitle = card.querySelector('h3').textContent;
        const project = projectDetails[projectTitle];

        document.getElementById('modal-title').textContent = projectTitle;
        
        // Create and set description content
        const descriptionEl = document.getElementById('modal-description');
        descriptionEl.innerHTML = project.description.replace(/\n/g, '<br>');
        
        // Update tech stack
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        project.tech.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            techContainer.appendChild(span);
        });

        // Update images if available
        const imagesContainer = document.getElementById('modal-images');
        imagesContainer.innerHTML = '';
        if (project.images && project.images.length > 0) {
            project.images.forEach(imgSrc => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `${projectTitle} screenshot`;
                imagesContainer.appendChild(img);
            });
        }

        // Update links based on project type
        const linksContainer = modal.querySelector('.modal-links');
        linksContainer.innerHTML = '';
        
        if (project.figmaLink) {
            // UI/UX project links
            const figmaLink = document.createElement('a');
            figmaLink.href = project.figmaLink;
            figmaLink.className = 'btn btn-small';
            figmaLink.textContent = 'View in Figma';
            linksContainer.appendChild(figmaLink);

            if (project.case_study) {
                const caseStudyLink = document.createElement('a');
                caseStudyLink.href = project.case_study;
                caseStudyLink.className = 'btn btn-small';
                caseStudyLink.textContent = 'View Case Study';
                linksContainer.appendChild(caseStudyLink);
            }
        } else {
            // Development project links
            const demoLink = document.createElement('a');
            demoLink.href = project.demo;
            demoLink.className = 'btn btn-small';
            demoLink.textContent = 'Live Demo';
            linksContainer.appendChild(demoLink);

            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.className = 'btn btn-small';
            githubLink.textContent = 'View Code';
            linksContainer.appendChild(githubLink);
        }

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateContent() {
    // Implementation of updateContent function
}

function setInitialLanguage(lang) {
    const option = document.querySelector(`.lang-option[data-lang="${lang}"]`);
    if (!option) return;
    
    const langCode = option.querySelector('.lang-code').textContent;
    const langName = option.querySelector('.lang-name').textContent;
    
    updateLanguageUI(lang, langCode, langName);
    setLanguage(lang);
}

function updateLanguageUI(lang, code, name) {
    const languageToggle = document.querySelector('.language-toggle');
    const currentLang = languageToggle.querySelector('.current-lang');
    const options = document.querySelectorAll('.lang-option');
    
    // Update toggle button
    currentLang.innerHTML = `
        <span class="lang-code">${code}</span>
        <span class="lang-name">${name}</span>
    `;
    languageToggle.setAttribute('aria-label', `Current language: ${name}`);
    
    // Update selected state
    options.forEach(option => {
        const isSelected = option.dataset.lang === lang;
        option.setAttribute('aria-selected', isSelected);
    });
    
    // Update document language
    document.documentElement.lang = lang;
}

// Navigation
const mainNav = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNavLinks = document.querySelector('.nav-links');
const navigationLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mainNavLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close mobile menu when clicking a link
navigationLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mainNavLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Active link highlighting
function setActiveLink() {
    const sections = document.querySelectorAll('section');
    const navHeight = mainNav.offsetHeight;
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 20;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navigationLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// Navbar scroll behavior
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
}

// Event listeners
window.addEventListener('scroll', () => {
    setActiveLink();
    handleNavbarScroll();
});

window.addEventListener('load', setActiveLink);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mainNavLinks.classList.contains('active') && 
        !mainNavLinks.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        mainNavLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

// Prevent menu-open class from persisting on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        mobileMenuBtn.classList.remove('active');
        mainNavLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}); 