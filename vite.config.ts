import path from 'path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const module = id.split("/node_modules/")[1];
          if (!module) {
            return; // void
          }
          if (module.match(/^@react-three\/drei\//)) return "drei";
          if (module.match(/^@react-three\/fiber\//)) return "fiber";
          if (module.match(/^three\//)) return "three";
          return; // void
        },
      }
    }
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@universe': path.resolve(__dirname, './src/universe'),
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@function': path.resolve(__dirname, './src/function'),
      '@state': path.resolve(__dirname, './src/state'),
      '@types': path.resolve(__dirname, './src/types'),
      '@shaders': path.resolve(__dirname, './src/shaders'),
    },
  },
})
