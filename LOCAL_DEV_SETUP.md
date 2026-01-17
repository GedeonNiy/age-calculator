# Local Development Setup for AI Chat

## Problem
Vercel serverless functions (`api/chat.ts`) don't work with `npm run dev` (Vite only). They need the Vercel dev server to run.

## Solution: Use Vercel Dev for Local Testing

### Option 1: Run Vercel Dev (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -D vercel
   ```

2. **Run Vercel Dev**:
   ```bash
   npm run dev:vercel
   ```
   
   This will:
   - Start Vite dev server on port 5173 (or next available)
   - Start Vercel serverless functions on port 3000
   - Proxy `/api/*` requests to the serverless functions
   - Load environment variables from `.env.local`

3. **Set your API key** in `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

4. **Test the chat widget** - it should now work!

### Option 2: Use Vite Dev with Proxy (Alternative)

If you prefer to use `npm run dev`, the Vite config now includes a proxy that forwards `/api/*` requests to `http://localhost:3000`. However, you'll still need to run `vercel dev` in a separate terminal to handle the API requests.

**Terminal 1:**
```bash
npm run dev:vercel
```

**Terminal 2 (if needed):**
```bash
npm run dev
```

## Troubleshooting

### Error: "Invalid response from server"
- Make sure `vercel dev` is running
- Check that `.env.local` has your API key
- Check browser console and terminal for detailed error messages

### Error: "OPENAI_API_KEY is not set"
- Verify `.env.local` exists in project root
- Check the file has: `OPENAI_API_KEY=sk-your-key`
- Restart `vercel dev` after adding the key

### API endpoint not found
- Make sure `api/chat.ts` exists in the project root
- Check that `vercel dev` is running
- Verify the proxy is working (check Vite console)

## Production
On Vercel, the serverless functions work automatically. Just make sure:
- `OPENAI_API_KEY` is set in Vercel environment variables
- The project is deployed





