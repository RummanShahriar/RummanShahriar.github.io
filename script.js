// Smooth scrolling and navigation functionality
function smoothScrollTo(element, behavior = 'smooth') {
  if (!element) return;
  
  const headerHeight = document.querySelector('.site-header').offsetHeight;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
  
  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: behavior
  });
}

// Initialize navigation functionality
function initNavigation() {
  // Navigation click handlers
  document.querySelectorAll('#nav-links a, #scroll-about').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.dataset.target || this.getAttribute('href')?.replace('#', '');
      if (!targetId) return;
      
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        smoothScrollTo(targetEl);
        history.replaceState(null, '', '#' + targetId);
        
        // Close mobile menu if open
        document.getElementById('nav-links').classList.remove('mobile-show');
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      const navLinks = document.getElementById('nav-links');
      navLinks.classList.toggle('mobile-show');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    const nav = document.getElementById('nav-links');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (nav && menuBtn && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove('mobile-show');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const navLinks = document.getElementById('nav-links');
      if (navLinks) {
        navLinks.classList.remove('mobile-show');
      }
    }
  });
}

// Active navigation detection using Intersection Observer
function initActiveNavigation() {
  const navLinks = Array.from(document.querySelectorAll('#nav-links a'));
  const sections = navLinks.map(link => {
    const targetId = link.dataset.target || link.getAttribute('href')?.replace('#', '');
    return document.getElementById(targetId);
  }).filter(Boolean);

  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0.1
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Find and activate the corresponding nav link
        const id = entry.target.id;
        const activeLink = navLinks.find(link => 
          (link.dataset.target || link.getAttribute('href')?.replace('#', '')) === id
        );
        
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section) navObserver.observe(section);
  });
}

// Reveal animation on scroll
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Animate skill bars when skills section is revealed
        if (entry.target.closest('#skills')) {
          setTimeout(() => {
            document.querySelectorAll('.bar span').forEach(span => {
              const width = span.getAttribute('data-width') || span.style.width;
              if (width) {
                span.style.width = width;
              }
            });
          }, 300);
        }
        
        // Unobserve after revealing to improve performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const statusEl = document.getElementById('form-status');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    if (!statusEl || !submitBtn) return;

    // Show loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    statusEl.textContent = 'Sending your message...';
    statusEl.style.color = '#6b6b6b';
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      statusEl.textContent = 'Thank you! Your message has been sent. I will get back to you within 24 hours.';
      statusEl.style.color = '#4ade80';
      
      // Reset form
      this.reset();
      
      // Reset button
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
      
      // Clear status after 5 seconds
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.style.color = '';
      }, 5000);
    }, 1500);
  });

  // Form validation styling
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.hasAttribute('required') && !this.value.trim()) {
        this.style.borderColor = 'rgba(220, 20, 60, 0.5)';
      } else {
        this.style.borderColor = 'rgba(255,255,255,0.15)';
      }
    });

    input.addEventListener('focus', function() {
      this.style.borderColor = 'var(--crimson)';
    });
  });
}

// Header scroll effects
function initHeaderEffects() {
  let lastScrollY = window.scrollY;
  
  const throttledScroll = throttle(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.style.background = 'rgba(10, 10, 15, 0.98)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.background = 'rgba(10, 10, 15, 0.95)';
      header.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
  }, 100);

  window.addEventListener('scroll', throttledScroll, { passive: true });
}

// Utility function for throttling
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize everything when DOM is loaded
function initializeApp() {
  // Handle initial hash on page load
  if (window.location.hash) {
    const targetId = window.location.hash.replace('#', '');
    const targetEl = document.getElementById(targetId);
    
    if (targetEl) {
      setTimeout(() => {
        smoothScrollTo(targetEl, 'auto');
      }, 100);
    }
  }
  
  // Add initial reveal class to elements already in viewport
  const revealElements = document.querySelectorAll('[data-reveal]');
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      el.classList.add('revealed');
    }
  });

  // Initialize all functionality
  initNavigation();
  initActiveNavigation();
  initRevealAnimations();
  initContactForm();
  initHeaderEffects();
}

// Performance optimization - check for reduced motion preference
function handleReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    
    // Remove smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable transitions for reduced motion users
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Error handling for missing elements
function handleErrors() {
  window.addEventListener('error', function(e) {
    console.error('Portfolio error:', e.error);
  });

  // Handle promise rejections
  window.addEventListener('unhandledrejection', function(e) {
    console.error('Portfolio promise rejection:', e.reason);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    handleReducedMotion();
    handleErrors();
    initializeApp();
  });
} else {
  handleReducedMotion();
  handleErrors();
  initializeApp();
}

// Additional load event for complete initialization
window.addEventListener('load', () => {
  // Ensure all images and resources are loaded before final setup
  setTimeout(() => {
    // Final adjustments after everything is loaded
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('revealed');
      }
    });
  }, 100);
});

// Export functions for potential external use
window.PortfolioUtils = {
  smoothScrollTo,
  initNavigation,
  initActiveNavigation,
  initRevealAnimations,
  initContactForm,
  initHeaderEffects
};
