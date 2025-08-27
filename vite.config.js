import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  
  return {
    plugins: [
      react()
    ],
    server: {
      port: parseInt(env.VITE_PORT) || 5173,
      // HTTPS configuration for PWA development
      // Generate certificates with: mkcert localhost [your-local-ip]
      https: {
        key: './localhost+2-key.pem',
        cert: './localhost+2.pem'
      },
      host: true,
      proxy: {
        '/api': `http://localhost:${env.PORT || 3001}`,
        '/ws': {
          target: `ws://localhost:${env.PORT || 3001}`,
          ws: true
        },
        '/shell': {
          target: `ws://localhost:${env.PORT || 3002}`,
          ws: true
        }
      }
    },
    build: {
      outDir: 'dist'
    }
  }
})