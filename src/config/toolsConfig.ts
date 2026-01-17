/**
 * Tools configuration - categories and icons
 */

export interface Tool {
  name: string;
  path: string;
  icon?: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  tools: Tool[];
}

export const CATEGORY_ICONS: Record<string, string> = {
  'date-time': '📅',
  'finance': '💰',
  'health': '🏥',
  'education': '📚',
  'document': '📄',
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'date-time',
    title: 'Date & Time',
    tools: [
      { name: 'Age Calculator', path: '/age-calculator', icon: '🎂' },
      { name: 'Date Difference', path: '/date-difference', icon: '📆' },
      { name: 'Pregnancy Due Date', path: '/pregnancy-due-date', icon: '👶' },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    tools: [
      { name: 'Mortgage Calculator', path: '/mortgage-calculator', icon: '🏠' },
      { name: 'Car Loan Calculator', path: '/car-loan-calculator', icon: '🚗' },
      { name: 'Compound Interest', path: '/compound-interest', icon: '💹' },
      { name: 'Income Tax Calculator', path: '/income-tax', icon: '💵' },
      { name: 'Currency Converter', path: '/currency-converter', icon: '💱' },
    ],
  },
  {
    id: 'health',
    title: 'Health',
    tools: [
      { name: 'BMI Calculator', path: '/bmi-calculator', icon: '⚖️' },
    ],
  },
  {
    id: 'education',
    title: 'Education',
    tools: [
      { name: 'GPA Calculator', path: '/gpa-calculator', icon: '📊' },
    ],
  },
  {
    id: 'document',
    title: 'Document & Text',
    tools: [
      { name: 'Plagiarism Checker', path: '/plagiarism-checker', icon: '🔍' },
      { name: 'PDF to Word', path: '/pdf-to-word', icon: '📝' },
      { name: 'Word to PDF', path: '/word-to-pdf', icon: '📄' },
      { name: 'Text to Speech', path: '/text-to-speech', icon: '🔊' },
      { name: 'Essay Improver', path: '/essay-improver', icon: '✍️' },
      { name: 'Summarizer', path: '/summarizer', icon: '📋' },
      { name: 'PDF ↔ JPG Converter', path: '/pdf-jpg-converter', icon: '🖼️' },
      { name: 'Citation Generator', path: '/citation-generator', icon: '📚' },
      { name: 'Grammar Checker', path: '/grammar-checker', icon: '✓' },
      { name: 'PDF Merge/Split', path: '/pdf-merge-split', icon: '📑' },
    ],
  },
];
