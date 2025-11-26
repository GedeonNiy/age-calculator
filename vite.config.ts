import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from network (for mobile testing)
    port: 5173, // Default Vite port
    strictPort: false, // Allow port to be changed if 5173 is busy
  },
});

