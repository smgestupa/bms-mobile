import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "$components": path.resolve( __dirname, "src/components" ),
      "$lib": path.resolve( __dirname, "src/lib" ),
      "$pages": path.resolve( __dirname, "src/pages" ),
    }
  }
})
