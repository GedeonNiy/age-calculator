/**
 * Vercel Serverless Function: /api/ai/summarizer
 * 
 * AI-powered text summarization using OpenAI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callOpenAI, type ChatMessage } from '../../src/server/openaiClient';

const SYSTEM_PROMPT = `You summarize academic and informational text. Keep the summary faithful to the original, with no new information.

Rules:
- Preserve key facts and main ideas
- Maintain the original meaning
- Do NOT add information not in the original
- Do NOT include your own opinions or interpretations
- Return ONLY the summary text, no explanations or notes`;

function getSummaryLength(length: string): string {
  switch (length) {
    case 'short':
      return 'Summarize in 1-2 sentences. Include only the most essential information.';
    case 'medium':
      return 'Summarize in a brief paragraph (3-5 sentences). Include main points and key details.';
    case 'detailed':
      return 'Provide a detailed summary (2-3 paragraphs). Include main points, supporting details, and important context.';
    default:
      return 'Summarize in a brief paragraph. Include main points and key details.';
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, length } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 20000) {
      return res.status(400).json({ error: 'Text is too long. Maximum 20,000 characters.' });
    }

    const lengthInstruction = getSummaryLength(length || 'medium');

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `${lengthInstruction}\n\nText to summarize:\n\n${text}` },
    ];

    const { reply } = await callOpenAI(messages);

    return res.status(200).json({
      summary: reply.trim(),
    });
  } catch (error: any) {
    console.error('[Summarizer API] Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to summarize text. Please try again.',
    });
  }
}

