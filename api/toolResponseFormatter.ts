/**
 * Helper function to format tool responses consistently
 * This is a reference format that the AI should follow
 */

export interface ToolResult {
  title: string;
  lines: string[];
  toolUrl: string;
}

/**
 * Format tool result in the standard short format
 * This is the format the AI should use for all calculation results
 */
export function formatToolResult(title: string, lines: string[], toolUrl: string): string {
  const bulletPoints = lines.map(line => `• ${line}`).join('\n');
  return [
    'Here are your results:',
    '',
    bulletPoints,
    '',
    `👉 Verify this in the tool: ${toolUrl}`,
  ].join('\n');
}

/**
 * Example usage for Age Tool:
 * formatToolResult(
 *   'Age',
 *   ['Age: 30 years, 5 months, 15 days'],
 *   'https://smartagetools.com/age-calculator'
 * )
 * 
 * Output:
 * "Here are your results:
 * 
 * • Age: 30 years, 5 months, 15 days
 * 
 * 👉 Verify this in the tool: https://smartagetools.com/age-calculator"
 */


