/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {
  registerPlugins
} from '@/plugins'

// Components
import App from './App.vue'

// Composables
import {
  createApp
} from 'vue'


String.prototype.pxWidth = function (font = 'normal 1rem Roboto, sans-serif') {
  var canvas = String.prototype.pxWidth.canvas || (String.prototype.pxWidth.canvas = document.createElement("canvas")),
    context = canvas.getContext("2d");

  font && (context.font = font);
  var metrics = context.measureText(this);

  return metrics.width;
}

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
