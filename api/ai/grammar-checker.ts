/**
 * Vercel Serverless Function: /api/ai/grammar-checker
 * 
 * AI-powered grammar and spelling checker using OpenAI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callOpenAI, type ChatMessage } from '../../src/server/openaiClient';

const SYSTEM_PROMPT = `You are a grammar and spelling corrector. Return the corrected version of the text. Do not change the meaning. Do not add or remove sentences. Just fix grammar, spelling, punctuation, and basic word choice.

Rules:
- Fix all grammar errors
- Correct spelling mistakes
- Fix punctuation errors
- Improve basic word choice if it's clearly wrong
- Preserve the original meaning completely
- Do NOT rewrite or restructure sentences unless grammatically necessary
- Do NOT add new information
- Return ONLY the corrected text, no explanations or notes`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 10000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 10,000 characters.' });
    }

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Correct the grammar and spelling in this text:\n\n${text}` },
    ];

    const { reply } = await callOpenAI(messages);

    return res.status(200).json({
      correctedText: reply.trim(),
    });
  } catch (error: any) {
    console.error('[Grammar Checker API] Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to check grammar. Please try again.',
    });
  }
}

