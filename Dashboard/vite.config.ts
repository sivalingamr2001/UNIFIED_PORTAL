import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/pes_lite/",
  build: {
    outDir: "../Artifact/wwwroot",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: any) => {
          if (assetInfo.name === 'index.html') {
            return 'index.html';
          }
          return `assets/${assetInfo.name}`;
        },
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/chunk-[name]-[hash].js`,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@product": path.resolve(__dirname, "./src/apps/product-custodian"),
      "@commodity": path.resolve(__dirname, "./src/apps/commodity-custodian"),
    },
  },
})
