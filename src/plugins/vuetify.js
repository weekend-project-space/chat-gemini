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

          primary: '#dd2323',
          background: '#f1f1f1'
        },
      },
      dark: {
        colors: {
          primary: '#fff',
          surface: '#171717',
          background: '#232323'
        },
      },
    },
  },
})
