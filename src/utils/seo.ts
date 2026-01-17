/**
 * SEO utility functions for managing meta tags, titles, and canonical URLs
 */

const BASE_URL = 'https://smartagetools.com';

export interface SEOData {
  title: string;
  description: string;
  path?: string;
  noindex?: boolean;
}

/**
 * Adds or updates JSON-LD structured data for Organization and WebSite
 */
export function updateStructuredData(): void {
  // Remove existing structured data scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => script.remove());

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Smart Tools Hub',
    'url': BASE_URL,
    'logo': `${BASE_URL}/vite.svg`,
    'description': 'Free online calculators and tools for dates, finance, health, education, and document management.',
    'sameAs': [],
    'contactPoint': {
      '@type': 'ContactPoint',
      'email': 'support@smartagetools.com',
      'contactType': 'Customer Service'
    }
  };

  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Smart Tools Hub',
    'url': BASE_URL,
    'description': 'Free online calculators and tools for dates, finance, health, education, and document management.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${BASE_URL}/tools?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // Create and inject Organization schema
  const orgScript = document.createElement('script');
  orgScript.type = 'application/ld+json';
  orgScript.textContent = JSON.stringify(organizationSchema);
  document.head.appendChild(orgScript);

  // Create and inject WebSite schema
  const websiteScript = document.createElement('script');
  websiteScript.type = 'application/ld+json';
  websiteScript.textContent = JSON.stringify(websiteSchema);
  document.head.appendChild(websiteScript);
}

/**
 * Updates SEO meta tags for the current page
 */
export function updateSEO(data: SEOData): void {
  const { title, description, path = '/', noindex } = data;
  const url = `${BASE_URL}${path}`;

  // Update title
  document.title = title;

  // Update or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);

  // Update or create robots meta
  if (noindex) {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex,follow');
  } else {
    // Remove noindex if it exists
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots && metaRobots.getAttribute('content')?.includes('noindex')) {
      metaRobots.remove();
    }
  }

  // Update or create canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', url);

  // Update or create Open Graph tags
  updateMetaTag('og:site_name', 'Smart Tools Hub', 'property');
  updateMetaTag('og:title', title, 'property');
  updateMetaTag('og:description', description, 'property');
  updateMetaTag('og:type', 'website', 'property');
  updateMetaTag('og:url', url, 'property');

  // Update or create Twitter Card tags
  updateMetaTag('twitter:card', 'summary', 'name');
  updateMetaTag('twitter:title', title, 'name');
  updateMetaTag('twitter:description', description, 'name');

  // Update structured data on page change
  updateStructuredData();
}

/**
 * Helper function to update or create a meta tag
 */
function updateMetaTag(propertyOrName: string, content: string, attribute: 'property' | 'name'): void {
  const selector = attribute === 'property' 
    ? `meta[property="${propertyOrName}"]`
    : `meta[name="${propertyOrName}"]`;
  
  let metaTag = document.querySelector(selector);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, propertyOrName);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
}





