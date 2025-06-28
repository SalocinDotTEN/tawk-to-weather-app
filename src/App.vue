<template>
  <v-app class="bg-background">
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
  import { onMounted, watch } from 'vue'
  import { useTheme } from 'vuetify'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const theme = useTheme()

  onMounted(() => {
    // Initialize theme system
    appStore.initializeTheme()

    // Set initial Vuetify theme
    theme.global.name.value = appStore.isDarkMode ? 'dark' : 'light'
  })

  // Watch for theme changes and update Vuetify theme
  watch(
    () => appStore.isDarkMode,
    isDark => {
      theme.global.name.value = isDark ? 'dark' : 'light'
    },
  )
</script>
