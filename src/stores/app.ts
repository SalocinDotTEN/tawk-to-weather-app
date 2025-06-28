// Utilities
import type { ThemeMode } from '@/types/theme'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    themeMode: 'system' as ThemeMode,
    systemPrefersDark: false,
  }),
  getters: {
    isDarkMode: state => {
      if (state.themeMode === 'system') {
        return state.systemPrefersDark
      }
      return state.themeMode === 'dark'
    },
  },
  actions: {
    initializeTheme () {
      // Load saved preference from localStorage
      const savedTheme = localStorage.getItem('theme-mode') as ThemeMode
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        this.themeMode = savedTheme
      }

      // Detect system preference
      this.systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', e => {
          this.systemPrefersDark = e.matches
        })
    },
    setThemeMode (mode: ThemeMode) {
      this.themeMode = mode
      localStorage.setItem('theme-mode', mode)
    },
    toggleTheme () {
      // Cycle through: light -> dark -> system
      if (this.themeMode === 'light') {
        this.setThemeMode('dark')
      } else if (this.themeMode === 'dark') {
        this.setThemeMode('system')
      } else {
        this.setThemeMode('light')
      }
    },
    setTheme (isDark: boolean) {
      this.setThemeMode(isDark ? 'dark' : 'light')
    },
  },
})
