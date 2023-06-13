import { defineConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), splitVendorChunkPlugin()],
  server: {
    open: true,
    host: true,
    port: 3120
  }
})
