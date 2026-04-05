import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the build works on Hugging Face Spaces
// (which serves from a subpath like /spaces/<user>/<repo>/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
