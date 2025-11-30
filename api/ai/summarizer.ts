/**
 * Vercel Serverless Function: /api/ai/summarizer
 * 
 * AI-powered text summarization using OpenAI
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callOpenAI, type ChatMessage } from '../openaiClient.js';

const SYSTEM_PROMPT = `You summarize academic and informational text. Keep the summary faithful to the original, with no new information. Return ONLY the summary text, with no explanations or commentary.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, length = 'medium' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Map length to instructions
    let lengthInstruction = '';
    switch (length) {
      case 'short':
        lengthInstruction = 'Provide a very brief summary in 1-2 sentences.';
        break;
      case 'detailed':
        lengthInstruction = 'Provide a detailed summary that captures most of the key points.';
        break;
      case 'medium':
      default:
        lengthInstruction = 'Provide a medium-length summary that captures the main points.';
        break;
    }

    const userMessage = `${lengthInstruction}\n\nText to summarize:\n${text}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
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
