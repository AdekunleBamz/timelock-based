/**
 * SEO utilities and meta tag management
 */

interface MetaTags {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

/**
 * Update document meta tags
 */
export function updateMetaTags(tags: MetaTags): void {
  // Title
  if (tags.title) {
    document.title = tags.title;
  }

  // Description
  if (tags.description) {
    updateMetaTag('name', 'description', tags.description);
  }

  // Keywords
  if (tags.keywords && tags.keywords.length > 0) {
    updateMetaTag('name', 'keywords', tags.keywords.join(', '));
  }

  // Open Graph tags
  if (tags.ogTitle) {
    updateMetaTag('property', 'og:title', tags.ogTitle);
  }
  if (tags.ogDescription) {
    updateMetaTag('property', 'og:description', tags.ogDescription);
  }
  if (tags.ogImage) {
    updateMetaTag('property', 'og:image', tags.ogImage);
  }
  if (tags.ogUrl) {
    updateMetaTag('property', 'og:url', tags.ogUrl);
  }

  // Twitter Card tags
  if (tags.twitterCard) {
    updateMetaTag('name', 'twitter:card', tags.twitterCard);
  }
  if (tags.twitterTitle) {
    updateMetaTag('name', 'twitter:title', tags.twitterTitle);
  }
  if (tags.twitterDescription) {
    updateMetaTag('name', 'twitter:description', tags.twitterDescription);
  }
  if (tags.twitterImage) {
    updateMetaTag('name', 'twitter:image', tags.twitterImage);
  }
}

function updateMetaTag(attr: string, key: string, value: string): void {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', value);
}

/**
 * Default SEO configuration
 */
export const DEFAULT_SEO: MetaTags = {
  title: 'Timelock Savings Vault - Build Financial Discipline',
  description: 'Lock your USDC on Base Mainnet and build financial discipline. Flexible lock periods, low minimum deposits, and emergency withdrawal options.',
  keywords: ['DeFi', 'Savings', 'Timelock', 'Base', 'USDC', 'Vault', 'Crypto'],
  ogTitle: 'Timelock Savings Vault',
  ogDescription: 'Lock your USDC and build financial discipline',
  ogImage: '/og-image.png',
  ogUrl: 'https://timelock-vault.example.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Timelock Savings Vault',
  twitterDescription: 'Lock your USDC and build financial discipline',
  twitterImage: '/og-image.png',
};

/**
 * Generate structured data for rich snippets
 */
export function generateStructuredData(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Timelock Savings Vault',
    description: 'Decentralized savings vault on Base Mainnet',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return JSON.stringify(data);
}

/**
 * Add structured data script to document
 */
export function addStructuredData(): void {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = generateStructuredData();
  document.head.appendChild(script);
}
