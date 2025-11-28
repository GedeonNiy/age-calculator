/**
 * Vercel Serverless Function: /api/ai/grammar-checker
 * 
 * AI-powered grammar and spelling checker using OpenAI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callOpenAI, type ChatMessage } from '../../src/server/openaiClient';

const SYSTEM_PROMPT = `You are a grammar and spelling corrector. Return the corrected version of the text. Do not change the meaning. Do not add or remove sentences. Just fix grammar, spelling, punctuation, and basic word choice. Return ONLY the corrected text, with no explanations or commentary.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const userMessage = `Correct the grammar, spelling, and punctuation in the following text:\n\n${text}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
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
