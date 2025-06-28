<template>
  <v-btn
    :icon="themeIcon"
    :title="themeTitle"
    variant="text"
    @click="toggleTheme"
  />
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useTheme } from 'vuetify'
  import { useAppStore } from '@/stores/app'

  const appStore = useAppStore()
  const theme = useTheme()

  const isDarkMode = computed(() => appStore.isDarkMode)
  const themeMode = computed(() => appStore.themeMode)

  const themeIcon = computed(() => {
    switch (themeMode.value) {
      case 'light': {
        return 'mdi-weather-sunny'
      }
      case 'dark': {
        return 'mdi-weather-night'
      }
      case 'system': {
        return 'mdi-theme-light-dark'
      }
      default: {
        return 'mdi-weather-sunny'
      }
    }
  })

  const themeTitle = computed(() => {
    switch (themeMode.value) {
      case 'light': {
        return 'Current: Light Mode (click to switch to Dark)'
      }
      case 'dark': {
        return 'Current: Dark Mode (click to switch to System)'
      }
      case 'system': {
        return `Current: System Mode (${isDarkMode.value ? 'Dark' : 'Light'}) (click to switch to Light)`
      }
      default: {
        return 'Toggle theme'
      }
    }
  })

  const toggleTheme = () => {
    appStore.toggleTheme()
    theme.global.name.value = isDarkMode.value ? 'dark' : 'light'
  }
</script>
