import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // Named import

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  build: {
    outDir: 'dist', // Adjust this path to point to your Express app's static folder
    emptyOutDir: true, // Clears the dist folder before building
  },
  define: {
    global: 'globalThis',
  },
  server: {
    watch: {
      usePolling: true
    }
  }
})