import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// http://socialpass.nftytesting.com/api
// http://127.0.0.1:8000/api
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://socialpass.nftytesting.com/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()]
})
