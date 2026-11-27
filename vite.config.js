import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so the build works on any host path (Vercel, GitHub Pages)
  base: './',
  // Vercel's Supabase integration names its public variables NEXT_PUBLIC_*.
  // Only these two prefixes reach the browser; secret keys have neither.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
})
