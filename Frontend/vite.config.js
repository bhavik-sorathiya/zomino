import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // extract package name from path
            const parts = id.split('node_modules/')[1].split('/')
            const pkg = parts[0].startsWith('@') ? parts.slice(0,2).join('/') : parts[0]
            // sanitize and return a vendor chunk name per package
            return `vendor-${pkg.replace('@', '').replace('/', '-')}`
          }
        }
      }
    }
  }
})
