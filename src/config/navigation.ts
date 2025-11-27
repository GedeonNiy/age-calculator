/**
 * Navigation configuration - single source of truth for all navigation items
 */

import { TOOL_CATEGORIES, CATEGORY_ICONS } from './toolsConfig';

export interface NavItem {
  label: string;
  route?: string;
  view?: string;
  type: 'link' | 'dropdown';
  children?: NavItem[];
  icon?: string; // For category icons
}

/**
 * Generate Tools dropdown structure from TOOL_CATEGORIES
 */
function generateToolsNavItems(): NavItem[] {
  const toolsNavItems: NavItem[] = [
    {
      label: 'All Tools',
      route: '/tools',
      type: 'link',
    },
  ];

  // Add each category as a nested dropdown
  TOOL_CATEGORIES.forEach(category => {
    const categoryItem: NavItem = {
      label: category.title,
      type: 'dropdown',
      icon: CATEGORY_ICONS[category.id] || '🧰',
      children: category.tools.map(tool => ({
        label: tool.name,
        route: tool.path,
        type: 'link',
        icon: tool.icon,
      })),
    };
    toolsNavItems.push(categoryItem);
  });

  return toolsNavItems;
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
    children: generateToolsNavItems(),
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

