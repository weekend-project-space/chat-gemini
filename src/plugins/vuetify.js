/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import {
  createVuetify
} from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#66f',
          secondary: '#6366F1',
          surface: '#f9f9f9'
        },
      },
      dark: {
        colors: {
          // primary: '#aaf',
          // surface: '#171717',
          // background: '#232323'
        },
      },
    },
  },
})
