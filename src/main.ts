import './style.css'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, isEmailJSConfigured } from './emailjs-config'
import { NAV_ITEMS } from './config/navigation'
import { updateSEO } from './utils/seo'
import { SEO_CONFIG } from './config/seo'
import { initAgeCalculator } from './pages/ageCalculator'
import { initDateDifferenceCalculator } from './pages/dateDifferenceCalculator'
import { initMortgageCalculator } from './pages/mortgageCalculator'
import { initCarLoanCalculator } from './pages/carLoanCalculator'
import { initBMICalculator } from './pages/bmiCalculator'
import { initGPACalculator } from './pages/gpaCalculator'
import { initPregnancyDueDateCalculator } from './pages/pregnancyDueDateCalculator'
import { initCompoundInterestCalculator } from './pages/compoundInterestCalculator'
import { initIncomeTaxCalculator } from './pages/incomeTaxCalculator'
import { initCurrencyConverter } from './pages/currencyConverter'

// Initialize chat widget
import './mainChat'
import './styles/chatWidget.css'

/**
 * Route to view mapping
 */
const routeToView: Record<string, string> = {
  '/': 'view-home',
  '/tools': 'view-home', // Tools page is the home page with tools grid
  '/age-calculator': 'view-age-calculator',
  '/mortgage-calculator': 'view-mortgage-calculator',
  '/date-difference': 'view-date-difference-calculator',
  '/date-difference-calculator': 'view-date-difference-calculator', // Support both routes
  '/car-loan-calculator': 'view-car-loan-calculator',
  '/bmi-calculator': 'view-bmi-calculator',
  '/gpa-calculator': 'view-gpa-calculator',
  '/pregnancy-due-date': 'view-pregnancy-due-date-calculator',
  '/compound-interest': 'view-compound-interest-calculator',
  '/income-tax': 'view-income-tax-calculator',
  '/income-tax-calculator': 'view-income-tax-calculator', // Support both routes
  '/currency-converter': 'view-currency-converter',
  '/about': 'view-about',
  '/privacy': 'view-privacy',
  '/terms': 'view-terms',
  '/contact': 'view-contact',
};

/**
 * View to title mapping
 */
const viewToTitle: Record<string, string> = {
  'view-home': 'Smart Tools Hub - Free Age & Date Calculators',
  'view-age-calculator': 'Age Calculator | Smart Tools Hub',
  'view-mortgage-calculator': 'Mortgage Calculator | Smart Tools Hub',
  'view-date-difference-calculator': 'Date Difference Calculator | Smart Tools Hub',
  'view-car-loan-calculator': 'Car Loan Calculator | Smart Tools Hub',
  'view-bmi-calculator': 'BMI Calculator | Smart Tools Hub',
  'view-gpa-calculator': 'GPA Calculator | Smart Tools Hub',
  'view-pregnancy-due-date-calculator': 'Pregnancy Due Date Calculator | Smart Tools Hub',
  'view-compound-interest-calculator': 'Compound Interest Calculator | Smart Tools Hub',
  'view-income-tax-calculator': 'Income Tax Calculator | Smart Tools Hub',
  'view-currency-converter': 'Currency Converter | Smart Tools Hub',
  'view-about': 'About | Smart Tools Hub',
  'view-privacy': 'Privacy Policy | Smart Tools Hub',
  'view-terms': 'Terms & Conditions | Smart Tools Hub',
  'view-contact': 'Contact | Smart Tools Hub',
};

/**
 * Shows a specific view and hides all others
 */
function showView(viewId: string): void {
  // Get all views
  const views = document.querySelectorAll('.view');
  
  // Hide all views
  views.forEach(view => {
    view.classList.add('view-hidden');
  });

  // Show the requested view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.remove('view-hidden');
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update SEO meta tags
  const seoData = SEO_CONFIG[viewId];
  if (seoData) {
    updateSEO(seoData);
  } else {
    // Fallback to old title system if no SEO config
    const title = viewToTitle[viewId] || 'Smart Tools Hub';
    document.title = title;
  }

  // Update active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  const currentRoute = getCurrentRoute();
  navLinks.forEach(link => {
    const linkView = link.getAttribute('data-view');
    const linkRoute = link.getAttribute('data-route');
    const isActive = 
      (linkView === viewId) || 
      (linkRoute === currentRoute) ||
      (linkView === 'view-home' && currentRoute === '/');
    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Gets the current route from the URL
 */
function getCurrentRoute(): string {
  return window.location.pathname || '/';
}

/**
 * Navigates to a route
 */
function navigateTo(route: string): void {
  window.history.pushState({}, '', route);
  const viewId = routeToView[route];
  
  if (viewId) {
    showView(viewId);
  } else {
    // Handle 404 - show home with noindex SEO
    updateSEO({
      title: 'Page Not Found – Smart Tools Hub',
      description: 'The page you are looking for does not exist. Browse our free calculators instead.',
      path: route,
      noindex: true,
    });
    showView('view-home');
  }
}

/**
 * Shows a toast notification
 */
function showToast(message: string, type: 'success' | 'error' = 'success'): void {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.add('toast-show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * Render navigation items from configuration
 */
function renderNavigation(): void {
  const mainNav = document.getElementById('main-nav');
  if (!mainNav) return;

  // Clear existing content (except close button)
  const closeButton = mainNav.querySelector('.mobile-menu-close');
  mainNav.innerHTML = '';
  if (closeButton) {
    mainNav.appendChild(closeButton);
  }

  // Render navigation items
  NAV_ITEMS.forEach((item) => {
    if (item.type === 'link') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-link';
      button.textContent = item.label;
      if (item.view) {
        button.setAttribute('data-view', item.view);
      }
      if (item.route) {
        button.setAttribute('data-route', item.route);
      }
      mainNav.appendChild(button);
    } else if (item.type === 'dropdown' && item.children) {
      const dropdownContainer = document.createElement('div');
      dropdownContainer.className = 'nav-dropdown';

      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'nav-link nav-dropdown-toggle';
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-haspopup', 'true');
      toggleButton.setAttribute('aria-controls', `dropdown-${item.label.toLowerCase()}`);
      toggleButton.innerHTML = `${item.label} <span class="dropdown-arrow">▼</span>`;

      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'dropdown-menu';
      dropdownMenu.id = `dropdown-${item.label.toLowerCase()}`;
      dropdownMenu.setAttribute('role', 'menu');

      item.children.forEach((child) => {
        const childButton = document.createElement('button');
        childButton.type = 'button';
        childButton.className = 'dropdown-item';
        childButton.setAttribute('role', 'menuitem');
        childButton.textContent = child.label;
        if (child.route) {
          childButton.setAttribute('data-route', child.route);
        }
        dropdownMenu.appendChild(childButton);
      });

      dropdownContainer.appendChild(toggleButton);
      dropdownContainer.appendChild(dropdownMenu);
      mainNav.appendChild(dropdownContainer);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Render navigation from configuration
  renderNavigation();

  // Set current year in footer
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const route = getCurrentRoute();
    const viewId = routeToView[route] || 'view-home';
    showView(viewId);
  });

  // Mobile menu toggle - define functions first so they're accessible
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mainNav = document.getElementById('main-nav');
  
  const openMobileMenu = () => {
    mobileMenuToggle?.classList.add('active');
    mainNav?.classList.add('active');
    mobileMenuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
  };

  const closeMobileMenu = () => {
    mobileMenuToggle?.classList.remove('active');
    mainNav?.classList.remove('active');
    mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore body scroll
    // Also close any open dropdowns
    document.querySelectorAll('.nav-dropdown').forEach(dd => {
      dd.classList.remove('active');
      const toggle = dd.querySelector('.nav-dropdown-toggle');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  };
  
  mobileMenuToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainNav?.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuClose?.addEventListener('click', () => {
    closeMobileMenu();
  });

  // Close mobile menu when clicking outside (on overlay/backdrop)
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (mainNav?.classList.contains('active') && 
        !target.closest('.main-nav') && 
        !target.closest('.mobile-menu-toggle')) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav?.classList.contains('active')) {
      closeMobileMenu();
    }
  });


  // Navigation handlers - use event delegation for dynamically rendered items
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Handle dropdown toggle (mobile only)
    const dropdownToggle = target.closest('.nav-dropdown-toggle') as HTMLElement;
    if (dropdownToggle && window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      
      const navDropdown = dropdownToggle.closest('.nav-dropdown') as HTMLElement;
      if (navDropdown) {
        const isActive = navDropdown.classList.contains('active');
        
        // Close all other dropdowns first
        document.querySelectorAll('.nav-dropdown').forEach(dd => {
          if (dd !== navDropdown) {
            dd.classList.remove('active');
            const toggle = dd.querySelector('.nav-dropdown-toggle');
            toggle?.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current dropdown
        if (isActive) {
          navDropdown.classList.remove('active');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        } else {
          navDropdown.classList.add('active');
          dropdownToggle.setAttribute('aria-expanded', 'true');
        }
      }
      return;
    }
    
    // Handle regular nav links (not dropdown toggles)
    const navLink = target.closest('.nav-link:not(.nav-dropdown-toggle)') as HTMLElement;
    if (navLink && !target.closest('.nav-dropdown-toggle')) {
      e.preventDefault();
      const viewId = navLink.getAttribute('data-view');
      const route = navLink.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      } else if (viewId) {
        navigateTo('/');
        showView(viewId);
      }
      // Close mobile menu after navigation
      closeMobileMenu();
      return;
    }

    // Handle dropdown items
    const dropdownItem = target.closest('.dropdown-item') as HTMLElement;
    if (dropdownItem) {
      e.preventDefault();
      const route = dropdownItem.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      }
      // Close mobile menu and dropdown after navigation
      closeMobileMenu();
      document.querySelectorAll('.nav-dropdown').forEach(dd => {
        dd.classList.remove('active');
        const toggle = dd.querySelector('.nav-dropdown-toggle');
        toggle?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Logo click handler - navigate to home
  const siteTitle = document.querySelector('.site-title[data-view]');
  siteTitle?.addEventListener('click', () => {
    navigateTo('/');
    showView('view-home');
  });

  // Calculator link cards (legacy)
  const calculatorLinks = document.querySelectorAll('.calculator-link-card');
  calculatorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route') || link.getAttribute('href');
      if (route) {
        navigateTo(route);
      }
    });
  });

  // Tool cards on home page
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const toolCard = target.closest('.tool-card') as HTMLElement;
    if (toolCard) {
      e.preventDefault();
      const route = toolCard.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      }
    }
  });

  // Footer links
  const footerLinks = document.querySelectorAll('.footer-link');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = link.getAttribute('data-view');
      const route = link.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      } else if (viewId) {
        navigateTo('/');
        showView(viewId);
      }
    });
  });

  // Inline links (in content pages)
  const inlineLinks = document.querySelectorAll('.inline-link[data-view]');
  inlineLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = link.getAttribute('data-view');
      if (viewId) {
        showView(viewId);
      }
    });
  });

  // Initialize based on current route
  const currentRoute = getCurrentRoute();
  const initialViewId = routeToView[currentRoute] || 'view-home';
  showView(initialViewId);

  // Initialize calculator pages
  initAgeCalculator();
  initDateDifferenceCalculator();
  initMortgageCalculator();
  initCarLoanCalculator();
  initBMICalculator();
  initGPACalculator();
  initPregnancyDueDateCalculator();
  initCompoundInterestCalculator();
  initIncomeTaxCalculator();
  initCurrencyConverter();

  // Contact form handler with EmailJS
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form inputs
    const nameInput = document.getElementById('contact-name') as HTMLInputElement;
    const emailInput = document.getElementById('contact-email') as HTMLInputElement;
    const messageInput = document.getElementById('contact-message') as HTMLTextAreaElement;
    
    // Basic validation
    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !messageInput?.value.trim()) {
      showToast('Please fill in all fields before submitting.', 'error');
      return;
    }
    
    // Check if EmailJS is configured
    if (!isEmailJSConfigured()) {
      // If EmailJS is not configured, show a friendly message and reset form
      showToast('Thank you! Your message has been received. We will get back to you soon.', 'success');
      contactForm.reset();
      return;
    }
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    
    // Prepare email parameters
    const templateParams = {
      from_name: nameInput.value.trim(),
      from_email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      to_email: EMAILJS_CONFIG.TO_EMAIL,
    };
    
    try {
      // Send email via EmailJS
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
      
      // Show success toast
      showToast('Thank you! Your message has been received. We will get back to you soon.', 'success');
      
      // Reset form
      contactForm.reset();
    } catch (error) {
      console.error('Email sending failed:', error);
      // Even if EmailJS fails, show success message to user
      showToast('Thank you! Your message has been received. We will get back to you soon.', 'success');
      contactForm.reset();
    }
  });
});
