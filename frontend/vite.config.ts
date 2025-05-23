import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/workout": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/exercise": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/muscle-group": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/working-set": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
