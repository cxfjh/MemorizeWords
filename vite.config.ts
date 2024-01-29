import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
// import legacy from '@vitejs/plugin-legacy'; // 离线打包插件
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export default defineConfig({
  base: './', // 设置项目的基础路径
  plugins: [
    // legacy({ targets: ['defaults', 'not IE 11', 'android >= 8'] }), // 使用离线打包插件，支持指定浏览器和 Android 版本
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[name]'
    })
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, // 设置模块路径别名
  build: {
    outDir: 'MemorizeWords', // 输出目录
    terserOptions: {
      compress: {
        drop_console: true, // 去除控制台输出语句
        drop_debugger: true, // 去除debugger语句
        pure_funcs: ['console.log'] // 去除指定的纯函数，例如console.log
      },
      mangle: true, // 启用代码混淆，缩短变量名
      format: { comments: false } // 设置输出格式，去除所有注释
    }
  }
});
