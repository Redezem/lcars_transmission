import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/transmission/rpc': {
        target: 'http://localhost:9091',
        changeOrigin: true,
      },
    },
  },
})
