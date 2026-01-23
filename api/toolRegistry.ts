/**
 * Tool Registry for Smart Tools Hub
 * Maps tool slugs to their display names and URLs
 */

export interface ToolInfo {
  label: string;
  href: string;
}

export const TOOL_LINKS: Record<string, ToolInfo> = {
  age: {
    label: 'Open Age Calculator',
    href: 'https://smartagetools.com/age-calculator',
  },
  'date-difference': {
    label: 'Open Date Difference Calculator',
    href: 'https://smartagetools.com/date-difference-calculator',
  },
  'pregnancy-due-date': {
    label: 'Open Pregnancy Due Date Calculator',
    href: 'https://smartagetools.com/pregnancy-due-date',
  },
  mortgage: {
    label: 'Open Mortgage Calculator',
    href: 'https://smartagetools.com/mortgage-calculator',
  },
  'car-loan': {
    label: 'Open Car Loan Calculator',
    href: 'https://smartagetools.com/car-loan-calculator',
  },
  bmi: {
    label: 'Open BMI Calculator',
    href: 'https://smartagetools.com/bmi-calculator',
  },
  gpa: {
    label: 'Open GPA Calculator',
    href: 'https://smartagetools.com/gpa-calculator',
  },
  'compound-interest': {
    label: 'Open Compound Interest Calculator',
    href: 'https://smartagetools.com/compound-interest',
  },
  'income-tax': {
    label: 'Open Income Tax Calculator',
    href: 'https://smartagetools.com/income-tax-calculator',
  },
  'currency-converter': {
    label: 'Open Currency Converter',
    href: 'https://smartagetools.com/currency-converter',
  },
};

/**
 * Format tool response with consistent structure
 * @param toolSlug - Tool identifier
 * @param summaryLines - Array of summary lines (bullet points)
 * @returns Formatted message with results and clickable link
 */
export function formatToolResponse(toolSlug: string, summaryLines: string[]): string {
  const toolInfo = TOOL_LINKS[toolSlug];
  if (!toolInfo) {
    // Fallback if tool not found
    return summaryLines.join('\n• ') + '\n\n👉 [Tool link not available]';
  }

  const bulletPoints = summaryLines.map(line => `• ${line}`).join('\n');
  const linkMarkdown = `👉 [${toolInfo.label}](${toolInfo.href})`;

  return `Here are your results:\n\n${bulletPoints}\n\n${linkMarkdown}`;
}






