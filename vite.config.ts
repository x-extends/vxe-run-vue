import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import XEUtils from 'xe-utils'
import zipPack from 'vite-plugin-zip-pack'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const now = Date.now()
  return {
    base: env.VITE_APP_BASE_PATH,
    define: {
      'import.meta.env.VITE_APP_DATE_NOW': now
    },
    plugins: [
      vue(),
      vueJsx(),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
            VITE_APP_DATE_NOW: now,
            VITE_APP_DATE_DATE: XEUtils.toDateString(now, 'yyyy-MM-dd HH:mm:ss')
          }
        }
      }),
      zipPack({
        outDir: './'
      })
    ],
    resolve: {
      alias: {
        '@': path.join(__dirname, './src')
      },
      extensions: ['.js', '.vue', '.json', '.ts', '.tsx']
    },
    optimizeDeps: {
      exclude: ['@vue/repl']
    },
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: Number(env.VITE_APP_SERVER_PORT)
    },
    build: {
      sourcemap: command === 'build' ? false : 'inline',
      outDir: 'dist',
      assetsDir: 'static'
    }
  }
})
