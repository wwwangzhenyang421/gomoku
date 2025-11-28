import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时，base 路径应该是仓库名
  // 如果仓库名不是 gomoku，请修改这里的路径，或设置环境变量 VITE_BASE_PATH
  base: process.env.NODE_ENV === 'production' 
    ? (process.env.VITE_BASE_PATH || '/gomoku/')
    : '/',
})
