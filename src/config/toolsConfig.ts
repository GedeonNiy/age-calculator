/**
 * Centralized tools configuration - single source of truth for all tools
 * Organized by categories for easy management and scaling
 */

export interface Tool {
  name: string;
  path: string;
  icon: string;
  description: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  description: string;
  tools: Tool[];
}

/**
 * Category icons mapping
 */
export const CATEGORY_ICONS: Record<string, string> = {
  'date-time': '📅',
  'finance': '💰',
  'health': '⚖️',
  'education': '🎓',
  'academic-tools': '📚',
  'other': '🧰',
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'date-time',
    title: 'Date & Time',
    description: 'Calculators for age, dates, and timelines.',
    tools: [
      {
        name: 'Age Calculator',
        path: '/age-calculator',
        icon: '🎂',
        description: 'Calculate your exact age in years, months, and days.',
      },
      {
        name: 'Date Difference',
        path: '/date-difference-calculator',
        icon: '📊',
        description: 'Find the difference between any two dates.',
      },
      {
        name: 'Pregnancy Due Date',
        path: '/pregnancy-due-date',
        icon: '👶',
        description: 'Estimate your due date and track pregnancy progress.',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Loans, interest, tax, and money tools.',
    tools: [
      {
        name: 'Mortgage Calculator',
        path: '/mortgage-calculator',
        icon: '🏠',
        description: 'Estimate your mortgage payment and payoff.',
      },
      {
        name: 'Car Loan Calculator',
        path: '/car-loan-calculator',
        icon: '🚗',
        description: 'Calculate monthly payments for your car loan.',
      },
      {
        name: 'Compound Interest Tool',
        path: '/compound-interest',
        icon: '📈',
        description: 'See how your money grows over time.',
      },
      {
        name: 'Income Tax Calculator',
        path: '/income-tax-calculator',
        icon: '💰',
        description: 'Estimate your income tax based on your income.',
      },
      {
        name: 'Currency Converter',
        path: '/currency-converter',
        icon: '💱',
        description: 'Convert between currencies using live rates.',
      },
    ],
  },
  {
    id: 'health',
    title: 'Health',
    description: 'Body metrics and health-related tools.',
    tools: [
      {
        name: 'BMI Calculator',
        path: '/bmi-calculator',
        icon: '⚖️',
        description: 'Check your Body Mass Index.',
      },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Student and learning helpers.',
    tools: [
      {
        name: 'GPA Calculator',
        path: '/gpa-calculator',
        icon: '🎓',
        description: 'Calculate your GPA from your grades.',
      },
    ],
  },
  {
    id: 'academic-tools',
    title: 'Academic & Documents',
    description: 'Powerful tools for students, teachers, and researchers.',
    tools: [
      {
        name: 'Plagiarism Checker',
        path: '/plagiarism-checker',
        icon: '🔍',
        description: 'Check text similarity between two documents locally.',
      },
      {
        name: 'PDF to Word',
        path: '/pdf-to-word',
        icon: '📄',
        description: 'Convert PDF files to Word documents (.docx).',
      },
      {
        name: 'Word to PDF',
        path: '/word-to-pdf',
        icon: '📝',
        description: 'Convert Word documents or text to PDF format.',
      },
      {
        name: 'Text-to-Speech',
        path: '/text-to-speech',
        icon: '🔊',
        description: 'Convert text to speech using browser voices.',
      },
      {
        name: 'Essay Improver',
        path: '/essay-improver',
        icon: '✍️',
        description: 'AI-powered tool to improve clarity and grammar of your writing.',
      },
      {
        name: 'Text Summarizer',
        path: '/summarizer',
        icon: '📋',
        description: 'AI-powered tool to summarize long articles and documents.',
      },
      {
        name: 'PDF ↔ JPG Converter',
        path: '/pdf-jpg-converter',
        icon: '🖼️',
        description: 'Convert PDF pages to JPG images or combine images into PDF.',
      },
      {
        name: 'Citation Generator',
        path: '/citation-generator',
        icon: '📚',
        description: 'Generate APA and MLA citations for books, articles, and websites.',
      },
      {
        name: 'Grammar Checker',
        path: '/grammar-checker',
        icon: '✓',
        description: 'AI-powered grammar and spelling checker for your text.',
      },
      {
        name: 'PDF Merger & Splitter',
        path: '/pdf-merge-split',
        icon: '📑',
        description: 'Merge multiple PDFs or split PDF pages into separate files.',
      },
    ],
  },
  {
    id: 'other',
    title: 'Other Tools',
    description: 'General tools and utilities. (More coming soon!)',
    tools: [
      // placeholder: no tools yet, but keep the section visible
    ],
  },
];

/**
 * Get all tools flattened (for search, etc.)
 */
export function getAllTools(): Tool[] {
  return TOOL_CATEGORIES.flatMap(category => category.tools);
}

/**
 * Get popular tools (for navigation dropdown)
 */
export const POPULAR_TOOLS: Tool[] = [
  {
    name: 'Age Calculator',
    path: '/age-calculator',
    icon: '🎂',
    description: 'Calculate your exact age in years, months, and days.',
  },
  {
    name: 'Mortgage Calculator',
    path: '/mortgage-calculator',
    icon: '🏠',
    description: 'Estimate your mortgage payment and payoff.',
  },
  {
    name: 'Currency Converter',
    path: '/currency-converter',
    icon: '💱',
    description: 'Convert between currencies using live rates.',
  },
  {
    name: 'BMI Calculator',
    path: '/bmi-calculator',
    icon: '⚖️',
    description: 'Check your Body Mass Index.',
  },
];

