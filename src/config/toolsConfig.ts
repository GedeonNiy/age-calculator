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
      { name: 'Date Difference Calculator', path: '/date-difference', icon: '📆' },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    tools: [
      { name: 'Mortgage Calculator', path: '/mortgage-calculator', icon: '🏠' },
    ],
  },
  {
    id: 'health',
    title: 'Health',
    tools: [
      { name: 'BMI Calculator', path: '/bmi-calculator', icon: '⚖️' },
    ],
  },
];
