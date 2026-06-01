// Name: Maksym Kholodenko, 05/31/2026
// Lab 7

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './',
    build: {
      sourcemap: true
    },
    server: {
      proxy: {
        '/api/link-preview': {
          target: 'https://api.linkpreview.net',
          changeOrigin: true,
          secure: true,
          rewrite: () => '',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader(
                'X-Linkpreview-Api-Key',
                env.LINKPREVIEW_API_KEY || ''
              );
            });
          }
        }
      }
    }
  };
});