// Fix Vite configuration for proper TypeScript and asset handling
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false, // Disable HMR overlay for production
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    assetsInlineLimit: 4096, // Inline smaller assets
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
