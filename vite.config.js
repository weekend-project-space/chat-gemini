// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, {
  transformAssetUrls
} from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'
import {
  VitePWA
} from 'vite-plugin-pwa'

// Utilities
import {
  defineConfig
} from 'vite'
import {
  fileURLToPath,
  URL
} from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: '极速ai',
        short_name: '极速ai',
        description: '极速ai',
        theme_color: '#ffffff',
        icons: [{
          src: 'logo.png',
          sizes: '192x192',
          type: 'image/png',
        }]
      }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src',
        import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
