import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // 指定输出目录
    assetsDir: 'assets', // 静态资源目录
  },
});
