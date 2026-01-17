/**
 * Single source of truth for all navigation routes
 */

export interface NavRoute {
  viewId: string;
  path: string;
  label: string;
}

export const NAV_ROUTES: NavRoute[] = [
  { viewId: 'view-home', path: '/', label: 'Home' },
  { viewId: 'view-about', path: '/about', label: 'About' },
  { viewId: 'view-contact', path: '/contact', label: 'Contact' },
  { viewId: 'view-privacy', path: '/privacy', label: 'Privacy Policy' },
  { viewId: 'view-terms', path: '/terms', label: 'Terms of Use' },
];

export const TOOL_ROUTES: NavRoute[] = [
  { viewId: 'view-tools', path: '/tools', label: 'All Tools' },
  { viewId: 'view-age-calculator', path: '/age-calculator', label: 'Age Calculator' },
  { viewId: 'view-date-difference', path: '/date-difference', label: 'Date Difference' },
  { viewId: 'view-bmi-calculator', path: '/bmi-calculator', label: 'BMI Calculator' },
  { viewId: 'view-mortgage-calculator', path: '/mortgage-calculator', label: 'Mortgage Calculator' },
];

// Create route to view mapping
export const routeToView: Record<string, string> = {
  ...Object.fromEntries(NAV_ROUTES.map(route => [route.path, route.viewId])),
  ...Object.fromEntries(TOOL_ROUTES.map(route => [route.path, route.viewId])),
};

