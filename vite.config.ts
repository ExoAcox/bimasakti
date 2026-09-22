import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/")) {
            return "three";
          }
          if (id.includes("node_modules/@react-three/drei/")) {
            return "three_drei";
          }
          if (id.includes("node_modules/postprocessing") || id.includes("node_modules/@react-three/postprocessing")) {
            return "three_postprocessing";
          }
        },
      },
    },
  },
});
