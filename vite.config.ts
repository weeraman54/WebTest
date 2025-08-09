import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  // base: process.env.VITE_SITE_URL || "/GeolexWeb",
  // server: {
  //   port: 5173,
  //   open: true
  // }
})
