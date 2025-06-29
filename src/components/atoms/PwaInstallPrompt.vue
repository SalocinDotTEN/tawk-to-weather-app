<template>
  <v-snackbar
    v-model="showInstallPrompt"
    color="primary"
    location="bottom"
    :timeout="-1"
  >
    <div class="d-flex align-center justify-space-between w-100">
      <div>
        <v-icon class="me-2" icon="mdi-download" />
        Install Weather App for a better experience
      </div>
      <div>
        <v-btn
          size="small"
          variant="text"
          @click="dismissPrompt"
        >
          Not now
        </v-btn>
        <v-btn
          color="white"
          size="small"
          variant="text"
          @click="installApp"
        >
          Install
        </v-btn>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  const showInstallPrompt = ref(false)
  let deferredPrompt: any = null

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      deferredPrompt = null
    }
    showInstallPrompt.value = false
  }

  const dismissPrompt = () => {
    showInstallPrompt.value = false
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  onMounted(() => {
    // Check if user has already dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')

    if (!dismissed) {
      window.addEventListener('beforeinstallprompt', e => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Save the event so it can be triggered later
        deferredPrompt = e
        // Show our custom install prompt
        showInstallPrompt.value = true
      })
    }

    // Listen for the app being installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      showInstallPrompt.value = false
      deferredPrompt = null
    })
  })
</script>
