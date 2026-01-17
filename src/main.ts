import './style.css'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, isEmailJSConfigured } from './emailjs-config'
import { updateSEO, updateStructuredData } from './utils/seo'
import { SEO_CONFIG } from './config/seo'
import { initAgeCalculator } from './pages/ageCalculator'
import { initBMICalculator } from './pages/bmiCalculator'
import { initMortgageCalculator } from './pages/mortgageCalculator'
import { initDateDifferenceCalculator } from './pages/dateDifferenceCalculator'
import { routeToView } from './config/routes'

interface AgeResult {
  years: number;
  months: number;
  days: number;
}

interface DateDifferenceResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

/**
 * Calculates age from date of birth to current date
 */
function calculateAge(dob: Date): AgeResult {
  const today = new Date();
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

/**
 * Calculates the difference between two dates
 */
function calculateDateDifference(start: Date, end: Date): DateDifferenceResult {
  // Calculate total days difference
  const timeDiff = end.getTime() - start.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // Calculate years, months, and remaining days
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let remainingDays = end.getDate() - start.getDate();

  // Adjust for negative days
  if (remainingDays < 0) {
    months--;
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    remainingDays += lastMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  const weeks = Math.floor(days / 7);

  return { days, weeks, months, years };
}

/**
 * Formats age result for display
 */
function formatAgeResult(result: AgeResult): string {
  const parts: string[] = [];
  if (result.years > 0) {
    parts.push(`${result.years} ${result.years === 1 ? 'year' : 'years'}`);
  }
  if (result.months > 0) {
    parts.push(`${result.months} ${result.months === 1 ? 'month' : 'months'}`);
  }
  if (result.days > 0 || parts.length === 0) {
    parts.push(`${result.days} ${result.days === 1 ? 'day' : 'days'}`);
  }
  return parts.join(', ');
}

/**
 * Formats date difference result for display
 */
function formatDateDifferenceResult(result: DateDifferenceResult): string {
  const parts: string[] = [];
  if (result.years > 0) {
    parts.push(`${result.years} ${result.years === 1 ? 'year' : 'years'}`);
  }
  if (result.months > 0) {
    parts.push(`${result.months} ${result.months === 1 ? 'month' : 'months'}`);
  }
  if (result.weeks > 0) {
    parts.push(`${result.weeks} ${result.weeks === 1 ? 'week' : 'weeks'}`);
  }
  if (result.days > 0 || parts.length === 0) {
    parts.push(`${result.days} ${result.days === 1 ? 'day' : 'days'}`);
  }
  return parts.join(', ');
}

/**
 * Shows an error message below an input element
 */
function showError(inputId: string, message: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (!input) return;

  // Remove existing error message
  const existingError = input.parentElement?.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  input.parentElement?.appendChild(errorDiv);
}

/**
 * Removes error message below an input element
 */
function clearError(inputId: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement;
  if (!input) return;
  const errorDiv = input.parentElement?.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Route to view mapping is now imported from config/routes.ts

// View initialization map
const viewInitializers: Record<string, () => void> = {
  'view-age-calculator': initAgeCalculator,
  'view-date-difference': initDateDifferenceCalculator,
  'view-bmi-calculator': initBMICalculator,
  'view-mortgage-calculator': initMortgageCalculator,
};

// Track if views have been initialized
const initializedViews = new Set<string>();

/**
 * Scrolls to top of page smoothly
 */
function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

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
    
    // Initialize the view if it has an initializer and hasn't been initialized yet
    if (viewInitializers[viewId] && !initializedViews.has(viewId)) {
      try {
        viewInitializers[viewId]();
        initializedViews.add(viewId);
      } catch (error) {
        console.error(`Error initializing view ${viewId}:`, error);
      }
    }
  }

  // Update active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkView = link.getAttribute('data-view');
    if (linkView === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update footer links
  const footerLinks = document.querySelectorAll('footer a[data-view]');
  footerLinks.forEach(link => {
    const linkView = link.getAttribute('data-view');
    if (linkView === viewId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update SEO metadata for the current view
  const seoData = SEO_CONFIG[viewId];
  if (seoData) {
    updateSEO(seoData);
  }

  // Update URL without reload
  const route = Object.entries(routeToView).find(([_, view]) => view === viewId)?.[0] || '/';
  window.history.pushState({ viewId }, '', route);

  // Scroll to top on route change
  scrollToTop();
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  const route = window.location.pathname;
  const viewId = routeToView[route] || 'view-home';
  showView(viewId);
});

// Handle initial route
function handleInitialRoute(): void {
  const route = window.location.pathname;
  const viewId = routeToView[route] || 'view-home';
  showView(viewId);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize structured data on page load
  updateStructuredData();

  // Navigation elements
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Set up navigation handlers
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const viewId = link.getAttribute('data-view');
      if (viewId) {
        showView(viewId);
      }
    });
  });

  // Tools dropdown functionality
  const toolsDropdownToggle = document.getElementById('tools-dropdown-toggle');
  const toolsDropdownMenu = document.getElementById('tools-dropdown-menu');
  
  if (toolsDropdownToggle && toolsDropdownMenu) {
    // Desktop: hover to show
    const navDropdown = toolsDropdownToggle.closest('.nav-dropdown');
    if (navDropdown) {
      navDropdown.addEventListener('mouseenter', () => {
        toolsDropdownMenu.classList.add('show');
      });
      navDropdown.addEventListener('mouseleave', () => {
        toolsDropdownMenu.classList.remove('show');
      });
    }
    
    // Mobile: click to toggle
    toolsDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toolsDropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!navDropdown?.contains(e.target as Node)) {
        toolsDropdownMenu.classList.remove('show');
      }
    });
    
    // Handle dropdown item clicks
    const dropdownItems = toolsDropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        if (viewId) {
          showView(viewId);
          toolsDropdownMenu.classList.remove('show');
        }
      });
    });
  }

  // Home tool cards click handlers
  const homeToolCards = document.querySelectorAll('.home-tool-card');
  homeToolCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = card.getAttribute('data-view');
      if (viewId) {
        showView(viewId);
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    const allNavItems = mainNav.querySelectorAll('.nav-link, .dropdown-item');
    allNavItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
        }
      });
    });
  }

  // Handle footer links
  const footerLinks = document.querySelectorAll('footer a[data-view]');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewId = link.getAttribute('data-view');
      if (viewId) {
        showView(viewId);
      }
    });
  });

  // Initialize tools listing page
  const toolsGridContainer = document.getElementById('tools-grid-container');
  if (toolsGridContainer) {
    import('./config/toolsConfig').then(({ TOOL_CATEGORIES }) => {
      toolsGridContainer.innerHTML = TOOL_CATEGORIES.map(category => `
        <div class="tool-category">
          <h2 class="category-title">${category.title}</h2>
          <div class="tools-in-category">
            ${category.tools.map(tool => `
              <div class="tool-card">
                <a href="#" data-view="${routeToView[tool.path] || ''}" class="tool-link" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; height: 100%;">
                  <span class="tool-icon">${tool.icon || '🧰'}</span>
                  <h4>${tool.name}</h4>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
      
      // Add click handlers to tool cards
      toolsGridContainer.querySelectorAll('.tool-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const viewId = link.getAttribute('data-view');
          if (viewId) {
            showView(viewId);
          }
        });
      });
    });
  }

  // Handle initial route
  handleInitialRoute();

  // Age Calculator elements
  const dobInput = document.getElementById('dob-input') as HTMLInputElement;
  const ageButton = document.getElementById('calculate-age-btn') as HTMLButtonElement;
  const ageResult = document.getElementById('age-result') as HTMLDivElement;

  // Date Difference Calculator elements
  const startDateInput = document.getElementById('start-date-input') as HTMLInputElement;
  const endDateInput = document.getElementById('end-date-input') as HTMLInputElement;
  const differenceButton = document.getElementById('calculate-difference-btn') as HTMLButtonElement;
  const differenceResult = document.getElementById('difference-result') as HTMLDivElement;

  // Age Calculator handler
  ageButton?.addEventListener('click', () => {
    clearError('dob-input');
    
    if (!dobInput?.value) {
      showError('dob-input', 'Please select a date of birth');
      return;
    }

    const dob = new Date(dobInput.value);
    const today = new Date();
    
    if (dob > today) {
      showError('dob-input', 'Date of birth cannot be in the future');
      return;
    }

    try {
      const result = calculateAge(dob);
      if (ageResult) {
        ageResult.textContent = formatAgeResult(result);
        ageResult.className = 'result success';
      }
    } catch (error) {
      showError('dob-input', 'Invalid date. Please try again.');
    }
  });

  // Date Difference Calculator handler
  differenceButton?.addEventListener('click', () => {
    clearError('start-date-input');
    clearError('end-date-input');

    if (!startDateInput?.value) {
      showError('start-date-input', 'Please select a start date');
      return;
    }

    if (!endDateInput?.value) {
      showError('end-date-input', 'Please select an end date');
      return;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate < startDate) {
      showError('end-date-input', 'End date cannot be before start date');
      return;
    }

    try {
      const result = calculateDateDifference(startDate, endDate);
      if (differenceResult) {
        differenceResult.textContent = formatDateDifferenceResult(result);
        differenceResult.className = 'result success';
      }
    } catch (error) {
      showError('end-date-input', 'Invalid dates. Please try again.');
    }
  });

  // Clear errors when inputs change
  dobInput?.addEventListener('input', () => clearError('dob-input'));
  startDateInput?.addEventListener('input', () => clearError('start-date-input'));
  endDateInput?.addEventListener('input', () => clearError('end-date-input'));

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
      alert('Please fill in all fields before submitting.');
      return;
    }
    
    // Check if EmailJS is configured
    if (!isEmailJSConfigured()) {
      alert('Email service is not configured yet. Please set up EmailJS credentials in src/emailjs-config.ts');
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
      
      // Show success popup
      alert('Your message has been submitted successfully!');
      
      // Reset form
      contactForm.reset();
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('Sorry, there was an error sending your message. Please try again later.');
    }
  });
});
