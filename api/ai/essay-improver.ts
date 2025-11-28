/**
 * Vercel Serverless Function: /api/ai/essay-improver
 * 
 * AI-powered essay improvement using OpenAI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callOpenAI, type ChatMessage } from '../../src/server/openaiClient';

const SYSTEM_PROMPT = `You are an academic writing assistant. The user will paste a paragraph or essay. Your job is to improve grammar, clarity, and readability while preserving the original meaning. Avoid adding new ideas or making up facts. Return ONLY the improved text, with no explanations or commentary.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, options = [] } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Build improvement instructions based on options
    let improvementInstructions = 'Improve the grammar, clarity, and readability.';
    
    if (Array.isArray(options)) {
      if (options.includes('clarity')) {
        improvementInstructions += ' Focus on making the text clearer and easier to understand.';
      }
      if (options.includes('formal')) {
        improvementInstructions += ' Make the tone more formal and academic.';
      }
      if (options.includes('concise')) {
        improvementInstructions += ' Make the text more concise while preserving all key information.';
      }
    }

    const userMessage = `${improvementInstructions}\n\nOriginal text:\n${text}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ];

    const { reply } = await callOpenAI(messages);

    return res.status(200).json({
      improvedText: reply.trim(),
    });
  } catch (error: any) {
    console.error('[Essay Improver API] Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to improve text. Please try again.',
    });
  }
}
