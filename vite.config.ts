import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import eslint from 'vite-plugin-eslint'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  // plugins: [react(), viteTsconfigPaths(), tailwindcss(), eslint()],
  plugins: [react(), viteTsconfigPaths(), tailwindcss()], // Remove this line to enable eslint
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  build: {
    outDir: './build',
    emptyOutDir: true,
  }
})
