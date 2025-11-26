/**
 * SEO configuration for all pages
 */

import type { SEOData } from '../utils/seo';

export const SEO_CONFIG: Record<string, SEOData> = {
  'view-home': {
    title: 'Smart Tools Hub – Free Online Calculators',
    description: 'Free, no sign-in online calculators for dates, finance, health, education and more. Smart Tools Hub offers 10+ fast, accurate tools in one place.',
    path: '/',
  },
  'view-age-calculator': {
    title: 'Age Calculator – Exact Age in Years, Months, and Days',
    description: 'Calculate your exact age in years, months, and days from your date of birth with this free online age calculator.',
    path: '/age-calculator',
  },
  'view-date-difference-calculator': {
    title: 'Date Difference Calculator – Days, Months, and Years Between Dates',
    description: 'Find the precise difference between any two dates in years, months, weeks, and days using this date difference calculator.',
    path: '/date-difference',
  },
  'view-pregnancy-due-date-calculator': {
    title: 'Pregnancy Due Date Calculator – Estimate Your Baby\'s Arrival',
    description: 'Estimate your pregnancy due date and track your progress week by week with this easy due date calculator.',
    path: '/pregnancy-due-date',
  },
  'view-mortgage-calculator': {
    title: 'Mortgage Calculator – Monthly Payment & Amortization',
    description: 'Calculate your monthly mortgage payment, total interest, payoff time and full amortization schedule with this smart mortgage calculator.',
    path: '/mortgage-calculator',
  },
  'view-car-loan-calculator': {
    title: 'Car Loan Calculator – Auto Payment & Interest',
    description: 'Estimate your monthly car payment, total interest, and payoff time with this free car loan calculator.',
    path: '/car-loan-calculator',
  },
  'view-compound-interest-calculator': {
    title: 'Compound Interest Calculator – Grow Your Savings',
    description: 'See how your money grows over time with this compound interest calculator. Adjust principal, rate, contributions and years.',
    path: '/compound-interest',
  },
  'view-income-tax-calculator': {
    title: 'Income Tax Calculator – Estimate Your Take-Home Pay',
    description: 'Estimate your income tax and approximate take-home pay with this simple income tax calculator.',
    path: '/income-tax',
  },
  'view-currency-converter': {
    title: 'Currency Converter – Real-Time Exchange Rates',
    description: 'Convert between popular currencies using live or regularly updated exchange rates with this free currency converter.',
    path: '/currency-converter',
  },
  'view-bmi-calculator': {
    title: 'BMI Calculator – Body Mass Index',
    description: 'Calculate your BMI (Body Mass Index) using height and weight, and see which weight category you fall into.',
    path: '/bmi-calculator',
  },
  'view-gpa-calculator': {
    title: 'GPA Calculator – Grade Point Average',
    description: 'Compute your GPA quickly with this grade point average calculator for schools, colleges, and universities.',
    path: '/gpa-calculator',
  },
  'view-about': {
    title: 'About Smart Tools Hub',
    description: 'Learn more about Smart Tools Hub, your home for simple, accurate online calculators for everyday life.',
    path: '/about',
  },
  'view-privacy': {
    title: 'Privacy Policy – Smart Tools Hub',
    description: 'Read how Smart Tools Hub handles data, cookies, and user privacy.',
    path: '/privacy',
    noindex: true,
  },
  'view-terms': {
    title: 'Terms of Use – Smart Tools Hub',
    description: 'Review the terms and conditions for using Smart Tools Hub and its free calculators.',
    path: '/terms',
    noindex: true,
  },
  'view-contact': {
    title: 'Contact – Smart Tools Hub',
    description: 'Contact Smart Tools Hub with questions, feedback, or requests for new tools.',
    path: '/contact',
    noindex: true,
  },
};

