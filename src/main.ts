/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// PWA
import { registerSW } from 'virtual:pwa-register'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

// Register service worker
const updateSW = registerSW({
  onNeedRefresh () {
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady () {
    console.log('App ready to work offline')
  },
})
