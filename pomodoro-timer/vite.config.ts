import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pomodoro-timer/', // GitHub Pagesの場合はリポジトリ名に変更
  server: {
    host: true,
  },
})
