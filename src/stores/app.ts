// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isDarkMode: false,
  }),
  actions: {
    toggleTheme () {
      this.isDarkMode = !this.isDarkMode
    },
    setTheme (isDark: boolean) {
      this.isDarkMode = isDark
    },
  },
})
