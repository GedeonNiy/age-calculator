/**
 * OpenAI API client helper
 * 
 * IMPORTANT: Set OPENAI_API_KEY in your environment variables:
 * - Local: Create .env.local file with OPENAI_API_KEY=your_key_here
 * - Vercel: Add OPENAI_API_KEY in project settings > Environment Variables
 */

import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface TokenUsage {
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens: number | null;
}

/**
 * Creates an OpenAI client instance
 * Throws error if API key is missing
 */
function createOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set on the server.');
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return client;
}

/**
 * Calls OpenAI Chat Completions API
 * 
 * @param messages Array of chat messages
 * @returns Promise with assistant reply and token usage
 */
export async function callOpenAI(
  messages: ChatMessage[]
): Promise<{ reply: string; usage: TokenUsage }> {
  const client = createOpenAIClient();
  
  try {
    console.log('[OpenAI Client] Calling API with', messages.length, 'messages');
    console.log('[OpenAI Client] API Key present:', !!process.env.OPENAI_API_KEY);
    console.log('[OpenAI Client] API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 7) + '...');
    
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
    });
    
    console.log('[OpenAI Client] API call successful');
    console.log('[OpenAI Client] Response choices:', response.choices?.length || 0);
    
    const reply = response.choices[0]?.message?.content || '';
    
    if (!reply) {
      console.warn('[OpenAI Client] Empty reply received');
    }
    
    const usage: TokenUsage = {
      promptTokens: response.usage?.prompt_tokens ?? null,
      completionTokens: response.usage?.completion_tokens ?? null,
      totalTokens: response.usage?.total_tokens ?? null,
    };
    
    console.log('[OpenAI Client] Token usage:', usage);
    
    return { reply, usage };
  } catch (error: any) {
    console.error('[OpenAI Client] API error:', error);
    console.error('[OpenAI Client] Error message:', error?.message);
    console.error('[OpenAI Client] Error type:', error?.constructor?.name);
    
    // Provide more specific error messages
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid or missing OpenAI API key. Please check your configuration.');
    }
    if (error?.status === 401) {
      throw new Error('OpenAI API authentication failed. Please check your API key.');
    }
    if (error?.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    }
    
    throw error;
  }
}

