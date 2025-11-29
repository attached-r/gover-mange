import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量，允许使用 API_KEY 或 VITE_API_KEY
  // Cast process to any to avoid TypeScript error about missing cwd property on global Process type
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // 关键修复：在构建时将 process.env.API_KEY 替换为具体字符串，防止浏览器崩溃
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || ''),
      // 防止第三方库调用 process.env 报错
      'process.env': {}
    }
  }
})