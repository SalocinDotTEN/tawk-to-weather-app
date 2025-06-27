<template>
  <v-btn
    :icon="isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
    :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
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

  const toggleTheme = () => {
    appStore.toggleTheme()
    theme.global.name.value = appStore.isDarkMode ? 'dark' : 'light'
  }
</script>
