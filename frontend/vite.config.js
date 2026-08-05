import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config with React plugin and dev server port proxy
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
