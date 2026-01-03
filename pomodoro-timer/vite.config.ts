import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Vercel用（GitHub Pagesの場合は '/pomodoro-timer/' に変更）
  server: {
    host: true,
  },
})
