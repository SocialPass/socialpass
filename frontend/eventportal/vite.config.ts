import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// http://socialpass.nftytesting.com/api
// http://127.0.0.1:8000/api
// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: process.env.VITE_APP_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [react()]
  })
}


