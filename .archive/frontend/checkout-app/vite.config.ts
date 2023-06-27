import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// http://socialpass.nftytesting.com/api
// http://127.0.0.1:8000/api
// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  return defineConfig({
    esbuild: {
      define: {
        this: 'window',
      },
    },
    server: {
      port: 3000,
    },
    plugins: [
      react(),
      htmlPlugin(loadEnv(mode, '.')),
    ],
    resolve: {
       alias: [{ find: '@', replacement: '/src' }],
    },
  })
}


/**
 * Replace env variables in index.html
 * @see https://github.com/vitejs/vite/issues/3105#issuecomment-939703781
 * @see https://vitejs.dev/guide/api-plugin.html#transformindexhtml
 */
function htmlPlugin(env: ReturnType<typeof loadEnv>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform: (html: string): string =>
        html.replace(/%(.*?)%/g, (match, p1) =>
          env[p1] ?? match
        ),
    }
  }
}