/**
 * Navigation configuration - single source of truth for all navigation items
 */

export interface NavItem {
  label: string;
  route?: string;
  view?: string;
  type: 'link' | 'dropdown';
  children?: NavItem[];
}

/**
 * Main navigation items
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    view: 'view-home',
    type: 'link',
  },
  {
    label: 'Tools',
    type: 'dropdown',
    children: [
      {
        label: 'Age Calculator',
        route: '/age-calculator',
        type: 'link',
      },
      {
        label: 'Date Difference',
        route: '/date-difference-calculator',
        type: 'link',
      },
      {
        label: 'Mortgage Calculator',
        route: '/mortgage-calculator',
        type: 'link',
      },
      {
        label: 'Car Loan Calculator',
        route: '/car-loan-calculator',
        type: 'link',
      },
      {
        label: 'BMI Calculator',
        route: '/bmi-calculator',
        type: 'link',
      },
      {
        label: 'GPA Calculator',
        route: '/gpa-calculator',
        type: 'link',
      },
      {
        label: 'Pregnancy Due Date',
        route: '/pregnancy-due-date',
        type: 'link',
      },
      {
        label: 'Compound Interest',
        route: '/compound-interest',
        type: 'link',
      },
      {
        label: 'Income Tax',
        route: '/income-tax-calculator',
        type: 'link',
      },
      {
        label: 'Currency Converter',
        route: '/currency-converter',
        type: 'link',
      },
    ],
  },
  {
    label: 'About',
    view: 'view-about',
    type: 'link',
  },
  {
    label: 'Privacy',
    view: 'view-privacy',
    type: 'link',
  },
  {
    label: 'Terms',
    view: 'view-terms',
    type: 'link',
  },
  {
    label: 'Contact',
    view: 'view-contact',
    type: 'link',
  },
];

