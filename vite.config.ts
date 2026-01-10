import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/mythic-gamemaster-emulator/',
  plugins: [react()],
  // server: {
  //   mimeTypes: {
  //     'application/wasm': ['wasm']
  //   }
  // }
})
