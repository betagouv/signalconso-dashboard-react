import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import eslint from 'vite-plugin-eslint'
import browserslistToEsbuild from 'browserslist-to-esbuild'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: false }),
    react(),
    viteTsconfigPaths(),
    tailwindcss(),
    eslint(),
    {
      name: 'html-app-version',
      transformIndexHtml: (html) => html.replace('%APP_VERSION%', version),
    },
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  build: {
    outDir: './build',
    emptyOutDir: true,
    target: browserslistToEsbuild(),
  },
})
