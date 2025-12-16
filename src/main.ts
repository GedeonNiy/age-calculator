import './style.css'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, isEmailJSConfigured } from './emailjs-config'
import { NAV_ITEMS } from './config/navigation'
import { TOOL_CATEGORIES, POPULAR_TOOLS, CATEGORY_ICONS } from './config/toolsConfig'
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
import { initPlagiarismChecker } from './pages/plagiarismChecker'
import { initPdfToWord } from './pages/pdfToWord'
import { initWordToPdf } from './pages/wordToPdf'
import { initTextToSpeech } from './pages/textToSpeech'
import { initEssayImprover } from './pages/essayImprover'
import { initSummarizer } from './pages/summarizer'
import { initPdfJpgConverter } from './pages/pdfJpgConverter'
import { initCitationGenerator } from './pages/citationGenerator'
import { initGrammarChecker } from './pages/grammarChecker'
import { initPdfMergeSplit } from './pages/pdfMergeSplit'

// Initialize chat widget
import './mainChat'
import './styles/chatWidget.css'

/**
 * Route to view mapping
 */
const routeToView: Record<string, string> = {
  '/': 'view-home',
  '/tools': 'view-tools', // All Tools page with categorized tools
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
  '/plagiarism-checker': 'view-plagiarism-checker',
  '/pdf-to-word': 'view-pdf-to-word',
  '/word-to-pdf': 'view-word-to-pdf',
  '/text-to-speech': 'view-text-to-speech',
  '/essay-improver': 'view-essay-improver',
  '/summarizer': 'view-summarizer',
  '/pdf-jpg-converter': 'view-pdf-jpg-converter',
  '/citation-generator': 'view-citation-generator',
  '/grammar-checker': 'view-grammar-checker',
  '/pdf-merge-split': 'view-pdf-merge-split',
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
  'view-tools': 'All Tools - Smart Tools Hub',
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
  'view-plagiarism-checker': 'Plagiarism Checker | Smart Tools Hub',
  'view-pdf-to-word': 'PDF to Word Converter | Smart Tools Hub',
  'view-word-to-pdf': 'Word to PDF Converter | Smart Tools Hub',
  'view-text-to-speech': 'Text-to-Speech Converter | Smart Tools Hub',
  'view-essay-improver': 'AI Essay Improver | Smart Tools Hub',
  'view-summarizer': 'Text Summarizer | Smart Tools Hub',
  'view-pdf-jpg-converter': 'PDF ↔ JPG Converter | Smart Tools Hub',
  'view-citation-generator': 'Citation Generator | Smart Tools Hub',
  'view-grammar-checker': 'Grammar Checker | Smart Tools Hub',
  'view-pdf-merge-split': 'PDF Merger & Splitter | Smart Tools Hub',
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

  // Re-render tools grid when navigating to tools page
  if (viewId === 'view-tools') {
    renderToolsGrid();
    // Handle hash navigation to scroll to category and expand it
    setTimeout(() => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        const categoryElement = document.getElementById(hash);
        if (categoryElement) {
          // Find the accordion header and content
          const accordionHeader = categoryElement.querySelector('.accordion-header') as HTMLElement;
          const accordionContent = categoryElement.querySelector('.accordion-content') as HTMLElement;
          const chevron = categoryElement.querySelector('.accordion-chevron') as HTMLElement;
          
          if (accordionHeader && accordionContent) {
            // Expand the category
            accordionHeader.setAttribute('aria-expanded', 'true');
            accordionContent.style.display = 'block';
            if (chevron) {
              chevron.style.transform = 'rotate(180deg)';
            }
          }
          
          // Scroll to category
          categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 150);
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
  // Extract path and hash if present
  const [path, hash] = route.split('#');
  window.history.pushState({}, '', route);
  const viewId = routeToView[path] || routeToView[route];
  
  if (viewId) {
    showView(viewId);
    // Handle hash navigation after view is shown
    if (hash) {
      setTimeout(() => {
        const categoryElement = document.getElementById(hash);
        if (categoryElement) {
          categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
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
 * Create a tool card element
 */
function createToolCard(tool: { name: string; path: string; icon: string; description: string }): HTMLElement {
  const toolCard = document.createElement('button');
  toolCard.type = 'button';
  toolCard.className = 'tool-card';
  toolCard.setAttribute('data-route', tool.path);

  const icon = document.createElement('div');
  icon.className = 'tool-icon';
  icon.textContent = tool.icon;

  const name = document.createElement('h4');
  name.textContent = tool.name;

  const description = document.createElement('p');
  description.textContent = tool.description;

  const arrow = document.createElement('span');
  arrow.className = 'tool-arrow';
  arrow.textContent = '→';

  toolCard.appendChild(icon);
  toolCard.appendChild(name);
  toolCard.appendChild(description);
  toolCard.appendChild(arrow);

  return toolCard;
}

/**
 * Render tools grid with accordion/collapsible categories (for All Tools page)
 */
function renderToolsGrid(): void {
  const container = document.getElementById('tools-grid-container');
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  TOOL_CATEGORIES.forEach((category) => {
    // Create accordion item
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    accordionItem.id = category.id; // Add ID for hash navigation

    // Accordion header (clickable)
    const accordionHeader = document.createElement('button');
    accordionHeader.type = 'button';
    accordionHeader.className = 'accordion-header';
    accordionHeader.setAttribute('aria-expanded', 'false'); // All collapsed by default
    accordionHeader.setAttribute('aria-controls', `accordion-content-${category.id}`);

    const headerContent = document.createElement('div');
    headerContent.className = 'accordion-header-content';

    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.textContent = CATEGORY_ICONS[category.id] || '🧰';

    const headerText = document.createElement('div');
    headerText.className = 'accordion-header-text';

    const title = document.createElement('h3');
    title.className = 'accordion-title';
    title.textContent = category.title;

    // Add category description under title
    const description = document.createElement('p');
    description.className = 'accordion-description';
    description.textContent = category.description;
    description.style.cssText = 'margin-top: 0.5rem; color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.5;';

    headerText.appendChild(title);
    headerText.appendChild(description);
    headerContent.appendChild(icon);
    headerContent.appendChild(headerText);

    const chevron = document.createElement('span');
    chevron.className = 'accordion-chevron';
    chevron.innerHTML = '▼';

    accordionHeader.appendChild(headerContent);
    accordionHeader.appendChild(chevron);

    // Accordion content (collapsible)
    const accordionContent = document.createElement('div');
    accordionContent.className = 'accordion-content';
    accordionContent.id = `accordion-content-${category.id}`;
    accordionContent.style.display = 'none'; // All collapsed by default

    const toolsContainer = document.createElement('div');
    toolsContainer.className = 'tools-in-category';

    if (category.tools.length === 0) {
      // Show "Coming soon" message for empty categories
      const comingSoon = document.createElement('p');
      comingSoon.className = 'coming-soon-message';
      comingSoon.textContent = 'More tools coming soon!';
      comingSoon.style.cssText = 'color: var(--color-text-secondary); font-style: italic; padding: var(--spacing-lg); text-align: center;';
      toolsContainer.appendChild(comingSoon);
    } else {
      // Create tool cards
      category.tools.forEach(tool => {
        toolsContainer.appendChild(createToolCard(tool));
      });
    }

    accordionContent.appendChild(toolsContainer);

    // Toggle functionality
    accordionHeader.addEventListener('click', () => {
      const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      accordionHeader.setAttribute('aria-expanded', String(newState));
      accordionContent.style.display = newState ? 'block' : 'none';
      chevron.style.transform = newState ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionContent);
    container.appendChild(accordionItem);
  });
}

/**
 * Render popular tools on home page
 */
function renderPopularTools(): void {
  const container = document.getElementById('popular-tools-container');
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  const toolsContainer = document.createElement('div');
  toolsContainer.className = 'tools-in-category';

  POPULAR_TOOLS.forEach(tool => {
    toolsContainer.appendChild(createToolCard(tool));
  });

  container.appendChild(toolsContainer);
}

// Removed renderCategoryCards - no longer needed on home page

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
        if (child.type === 'dropdown' && child.children) {
          // Nested dropdown (category with tools)
          const nestedDropdown = document.createElement('div');
          nestedDropdown.className = 'nested-dropdown';

          const nestedToggle = document.createElement('button');
          nestedToggle.type = 'button';
          nestedToggle.className = 'dropdown-item nested-dropdown-toggle';
          nestedToggle.setAttribute('aria-expanded', 'false');
          nestedToggle.setAttribute('aria-haspopup', 'true');
          
          // Add icon if present
          if (child.icon) {
            nestedToggle.innerHTML = `<span class="dropdown-icon">${child.icon}</span> ${child.label} <span class="nested-arrow">▶</span>`;
          } else {
            nestedToggle.innerHTML = `${child.label} <span class="nested-arrow">▶</span>`;
          }

          const nestedMenu = document.createElement('div');
          nestedMenu.className = 'nested-dropdown-menu';
          nestedMenu.setAttribute('role', 'menu');

          child.children.forEach((tool) => {
            const toolButton = document.createElement('button');
            toolButton.type = 'button';
            toolButton.className = 'dropdown-item nested-dropdown-item';
            toolButton.setAttribute('role', 'menuitem');
            
            // Add icon if present
            if (tool.icon) {
              toolButton.innerHTML = `<span class="dropdown-icon">${tool.icon}</span> ${tool.label}`;
            } else {
              toolButton.textContent = tool.label;
            }
            
            if (tool.route) {
              toolButton.setAttribute('data-route', tool.route);
            }
            nestedMenu.appendChild(toolButton);
          });

          // Toggle nested dropdown
          nestedToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = nestedToggle.getAttribute('aria-expanded') === 'true';
            nestedToggle.setAttribute('aria-expanded', String(!isExpanded));
            (nestedMenu as HTMLElement).style.display = !isExpanded ? 'block' : 'none';
            const arrow = nestedToggle.querySelector('.nested-arrow') as HTMLElement;
            if (arrow) {
              arrow.style.transform = !isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
            }
          });

          nestedDropdown.appendChild(nestedToggle);
          nestedDropdown.appendChild(nestedMenu);
          dropdownMenu.appendChild(nestedDropdown);
        } else {
          // Regular dropdown item (link)
          const childButton = document.createElement('button');
          childButton.type = 'button';
          childButton.className = 'dropdown-item';
          childButton.setAttribute('role', 'menuitem');
          
          // Add icon if present
          if (child.icon) {
            childButton.innerHTML = `<span class="dropdown-icon">${child.icon}</span> ${child.label}`;
          } else {
            childButton.textContent = child.label;
          }
          
          if (child.route) {
            childButton.setAttribute('data-route', child.route);
          }
          dropdownMenu.appendChild(childButton);
        }
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

  // Render tools grid from configuration (for All Tools page)
  renderToolsGrid();

  // Render popular tools on home page
  renderPopularTools();

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
    // Close nested dropdowns
    document.querySelectorAll('.nested-dropdown-toggle').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
      const menu = toggle.nextElementSibling as HTMLElement;
      if (menu && menu.classList.contains('nested-dropdown-menu')) {
        menu.style.display = 'none';
      }
      const arrow = toggle.querySelector('.nested-arrow') as HTMLElement;
      if (arrow) {
        arrow.style.transform = 'rotate(0deg)';
      }
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
      return;
    }

    // Category card links
    const categoryCardLink = target.closest('.category-card-link') as HTMLElement;
    if (categoryCardLink) {
      e.preventDefault();
      const route = categoryCardLink.getAttribute('data-route');
      if (route) {
        navigateTo(route);
      }
      return;
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
  
  // Initialize academic tools
  initPlagiarismChecker();
  initPdfToWord();
  initWordToPdf();
  initTextToSpeech();
  initEssayImprover();
  initSummarizer();
  initPdfJpgConverter();
  initCitationGenerator();
  initGrammarChecker();
  initPdfMergeSplit();

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
