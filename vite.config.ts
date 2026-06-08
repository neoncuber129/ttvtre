import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages cần /ttvtre/ — set VITE_BASE_PATH trong workflow.
  // Vercel và local dùng / (mặc định).
  base: process.env.VITE_BASE_PATH || '/',
})
