/**
 * Development server for local API testing
 * Runs the chat API endpoint locally without Vercel
 */

// CRITICAL: Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local file explicitly
const envPath = resolve(process.cwd(), '.env.local');
const envResult = dotenv.config({ path: envPath });

// Also try .env as fallback
if (envResult.error) {
  dotenv.config({ path: resolve(process.cwd(), '.env') });
}

// Now import other modules AFTER environment is loaded
import express from 'express';
import handler from './chat.js';

// Log environment status (without exposing the key)
console.log('🔑 Environment check:');
const apiKey = process.env.OPENAI_API_KEY;
console.log('   OPENAI_API_KEY present:', !!apiKey);
if (apiKey) {
  // Check if it's still the placeholder
  if (apiKey === 'YOUR_OPENAI_KEY_HERE' || apiKey.startsWith('YOUR_')) {
    console.log('   ⚠️  WARNING: OPENAI_API_KEY is still set to placeholder value!');
    console.log('   Please replace it with your actual OpenAI API key in .env.local');
  } else {
    console.log('   OPENAI_API_KEY prefix:', apiKey.substring(0, 7) + '...');
  }
} else {
  console.log('   ⚠️  OPENAI_API_KEY not found!');
  console.log('   Make sure .env.local exists in project root with:');
  console.log('   OPENAI_API_KEY=sk-your-actual-key-here');
}

const app = express();
const PORT = 3001;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Root route - helpful message
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Tools Hub API Server',
    endpoints: {
      '/api/chat': 'POST - Chat with AI assistant',
    },
    note: 'This is the API server. Access the frontend at http://localhost:5173',
  });
});

// Convert Express req/res to Vercel format
app.post('/api/chat', async (req, res) => {
  // Double-check environment variable is available at request time
  if (!process.env.OPENAI_API_KEY) {
    console.error('[dev-server] OPENAI_API_KEY missing at request time!');
    console.error('[dev-server] Re-loading .env.local...');
    // Try to reload environment
    dotenv.config({ path: resolve(process.cwd(), '.env.local') });
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'Server is missing OPENAI_API_KEY. Please configure it in .env.local and restart the server.' 
      });
    }
  }

  const vercelReq = {
    method: req.method,
    body: req.body,
    headers: req.headers,
    url: req.url,
    query: req.query,
  };

  const vercelRes = {
    status: (code: number) => ({
      json: (data: any) => {
        res.status(code).json(data);
      },
    }),
    json: (data: any) => {
      res.json(data);
    },
  };

  try {
    await handler(vercelReq as any, vercelRes as any);
  } catch (error: any) {
    console.error('API handler error:', error);
    res.status(500).json({ 
      error: error?.message || 'Internal server error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
  console.log(`📝 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔑 Make sure OPENAI_API_KEY is set in .env.local`);
});

