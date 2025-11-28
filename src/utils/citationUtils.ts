/**
 * Citation Generator Utilities
 * Formats citations in APA and MLA styles
 */

export type CitationStyle = 'APA' | 'MLA';
export type SourceType = 'book' | 'article' | 'website' | 'youtube';

export interface CitationData {
  style: CitationStyle;
  type: SourceType;
  author?: string;
  year?: string;
  title?: string;
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  websiteName?: string;
  url?: string;
  dateAccessed?: string;
  channelName?: string;
  videoTitle?: string;
  uploadDate?: string;
}

/**
 * Format APA Book citation
 */
function formatApaBook(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.author) {
    parts.push(data.author);
  }
  
  if (data.year) {
    parts.push(`(${data.year})`);
  }
  
  if (data.title) {
    parts.push(data.title);
  }
  
  if (data.publisher) {
    parts.push(data.publisher);
  }
  
  return parts.join('. ') + '.';
}

/**
 * Format APA Journal Article citation
 */
function formatApaArticle(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.author) {
    parts.push(data.author);
  }
  
  if (data.year) {
    parts.push(`(${data.year})`);
  }
  
  if (data.title) {
    parts.push(data.title);
  }
  
  if (data.journal) {
    parts.push(data.journal);
  }
  
  if (data.volume) {
    if (data.issue) {
      parts.push(`${data.volume}(${data.issue})`);
    } else {
      parts.push(data.volume);
    }
  }
  
  if (data.pages) {
    parts.push(data.pages);
  }
  
  return parts.join('. ') + '.';
}

/**
 * Format APA Website citation
 */
function formatApaWebsite(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.author) {
    parts.push(data.author);
  }
  
  if (data.year || data.dateAccessed) {
    const date = data.year || (data.dateAccessed ? new Date(data.dateAccessed).getFullYear() : 'n.d.');
    parts.push(`(${date})`);
  }
  
  if (data.title) {
    parts.push(data.title);
  }
  
  if (data.websiteName) {
    parts.push(data.websiteName);
  }
  
  if (data.url) {
    parts.push(data.url);
  }
  
  return parts.join('. ') + '.';
}

/**
 * Format APA YouTube citation
 */
function formatApaYoutube(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.channelName) {
    parts.push(data.channelName);
  }
  
  if (data.uploadDate) {
    const date = new Date(data.uploadDate);
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    parts.push(`(${year}, ${month} ${day})`);
  }
  
  if (data.videoTitle) {
    parts.push(data.videoTitle);
  }
  
  parts.push('[Video]');
  
  if (data.url) {
    parts.push(`YouTube. ${data.url}`);
  }
  
  return parts.join('. ') + '.';
}

/**
 * Format MLA Book citation
 */
function formatMlaBook(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.author) {
    parts.push(data.author + '.');
  }
  
  if (data.title) {
    parts.push(`"${data.title}."`);
  }
  
  if (data.publisher) {
    parts.push(data.publisher + ',');
  }
  
  if (data.year) {
    parts.push(data.year + '.');
  }
  
  return parts.join(' ');
}

/**
 * Format MLA Journal Article citation
 */
function formatMlaArticle(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.author) {
    parts.push(data.author + '.');
  }
  
  if (data.title) {
    parts.push(`"${data.title}."`);
  }
  
  if (data.journal) {
    parts.push(data.journal + ',');
  }
  
  if (data.volume) {
    if (data.issue) {
      parts.push(`vol. ${data.volume}, no. ${data.issue},`);
    } else {
      parts.push(`vol. ${data.volume},`);
    }
  }
  
  if (data.year) {
    parts.push(data.year + ',');
  }
  
  if (data.pages) {
    parts.push(`pp. ${data.pages}.`);
  }
  
  return parts.join(' ');
}

/**
 * Format MLA Website citation
 */
function formatMlaWebsite(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.author) {
    parts.push(data.author + '.');
  }
  
  if (data.title) {
    parts.push(`"${data.title}."`);
  }
  
  if (data.websiteName) {
    parts.push(data.websiteName + ',');
  }
  
  if (data.dateAccessed) {
    const date = new Date(data.dateAccessed);
    const formatted = date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    parts.push(formatted + ',');
  }
  
  if (data.url) {
    parts.push(data.url + '.');
  }
  
  return parts.join(' ');
}

/**
 * Format MLA YouTube citation
 */
function formatMlaYoutube(data: CitationData): string {
  const parts: string[] = [];
  
  if (data.videoTitle) {
    parts.push(`"${data.videoTitle}."`);
  }
  
  parts.push('YouTube,');
  
  if (data.channelName) {
    parts.push(`uploaded by ${data.channelName},`);
  }
  
  if (data.uploadDate) {
    const date = new Date(data.uploadDate);
    const formatted = date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    parts.push(formatted + ',');
  }
  
  if (data.url) {
    parts.push(data.url + '.');
  }
  
  return parts.join(' ');
}

/**
 * Generate citation based on style and type
 */
export function generateCitation(data: CitationData): string {
  if (data.style === 'APA') {
    switch (data.type) {
      case 'book':
        return formatApaBook(data);
      case 'article':
        return formatApaArticle(data);
      case 'website':
        return formatApaWebsite(data);
      case 'youtube':
        return formatApaYoutube(data);
      default:
        return 'Unsupported source type for APA style.';
    }
  } else {
    // MLA
    switch (data.type) {
      case 'book':
        return formatMlaBook(data);
      case 'article':
        return formatMlaArticle(data);
      case 'website':
        return formatMlaWebsite(data);
      case 'youtube':
        return formatMlaYoutube(data);
      default:
        return 'Unsupported source type for MLA style.';
    }
  }
}
