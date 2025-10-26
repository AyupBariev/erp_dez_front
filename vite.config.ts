import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl: string = env.VITE_BACKEND_API_URL || 'http://localhost:8080';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          // configure: (proxy, _options) => {
          //   proxy.on('proxyReq', (proxyReq, req, _res) => {
          //     console.log('Proxying:', req.method, req.url, '→', proxyReq.path);
          //   });
          // },
        },
      },
    },
  };
});