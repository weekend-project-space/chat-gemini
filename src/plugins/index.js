/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
// import pinia from '../store'
import AutoHeightTextarea from '../components/AutoHeightTextarea.vue'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(router)
    .component('autotextarea', AutoHeightTextarea)
  // .use(pinia)
}
