import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // ✅ ADD UPLOAD-SPECIFIC CONFIGURATION
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // ✅ Special handling for upload requests
            if (req.url.includes('/admin/upload')) {
              console.log('Upload request detected, setting longer timeouts');
              proxyReq.setTimeout(300000); // 5 minutes
            }
          });
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
})