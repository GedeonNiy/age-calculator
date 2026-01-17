/**
 * Vercel Serverless Function: /api/ai/essay-improver
 * 
 * AI-powered essay improvement using OpenAI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callOpenAI, type ChatMessage } from '../../src/server/openaiClient';

const SYSTEM_PROMPT = `You are an academic writing assistant. The user will paste a paragraph or essay. Your job is to improve grammar, clarity, and readability while preserving the original meaning. Avoid adding new ideas or making up facts.

Rules:
- Fix grammar, spelling, and punctuation errors
- Improve sentence structure and flow
- Enhance clarity and readability
- Preserve the original meaning and tone
- Do NOT add new information or ideas
- Do NOT change the core message
- Return ONLY the improved text, no explanations or notes

If the user requests specific improvements (clarity, formality, conciseness), apply those while maintaining the original meaning.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, options } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 10000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 10,000 characters.' });
    }

    // Build improvement instructions
    let improvementInstructions = 'Improve this text:';
    if (options && Array.isArray(options)) {
      if (options.includes('clarity')) {
        improvementInstructions += ' Make it clearer and easier to understand.';
      }
      if (options.includes('formal')) {
        improvementInstructions += ' Make it more formal and academic.';
      }
      if (options.includes('concise')) {
        improvementInstructions += ' Make it more concise and to the point.';
      }
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `${improvementInstructions}\n\n${text}` },
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

