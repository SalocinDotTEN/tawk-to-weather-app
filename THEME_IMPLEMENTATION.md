# Theme Management Implementation

## Overview
The theme management system has been enhanced to support three modes:
- **Light Mode**: Always use light theme
- **Dark Mode**: Always use dark theme  
- **System Mode**: Follow the system's preference (default)

## Features

### State Persistence
- Theme preferences are saved to localStorage
- The selected mode persists across browser sessions
- Key used: `theme-mode`

### System Preference Detection
- Automatically detects the user's system theme preference
- Listens for changes to system theme and updates accordingly
- Only applies when mode is set to 'system'

### Theme Cycling
The theme toggle button cycles through modes in this order:
1. Light → Dark → System → Light (repeat)

### Visual Indicators
The theme toggle button shows different icons based on the current mode:
- ☀️ `mdi-weather-sunny` - Light mode
- 🌙 `mdi-weather-night` - Dark mode  
- 🎨 `mdi-theme-light-dark` - System mode

## Implementation Details

### Store Structure (`src/stores/app.ts`)
```typescript
state: {
  themeMode: 'system' | 'light' | 'dark'  // Current mode selection
  systemPrefersDark: boolean               // System preference detection
}

getters: {
  isDarkMode: boolean                      // Computed dark/light state
}

actions: {
  initializeTheme()                        // Initialize on app start
  setThemeMode(mode)                       // Set specific mode
  toggleTheme()                            // Cycle through modes
}
```

### Component Integration
- `App.vue`: Initializes theme system and watches for changes
- `ThemeToggle.vue`: Provides UI for theme switching with visual indicators
- Vuetify theme automatically syncs with the computed `isDarkMode` state

### Auto-Initialization
The theme system automatically initializes when the app starts:
1. Loads saved preference from localStorage (defaults to 'system')
2. Detects current system preference
3. Sets up listener for system theme changes
4. Applies the appropriate theme to Vuetify

## Usage

### For Users
- Click the theme toggle button to cycle through modes
- Hover over the button to see current mode and next action
- Preferences are automatically saved

### For Developers
```typescript
// Get current theme state
const appStore = useAppStore()
const isDark = appStore.isDarkMode
const mode = appStore.themeMode

// Set specific mode
appStore.setThemeMode('dark')
appStore.setThemeMode('light') 
appStore.setThemeMode('system')

// Toggle through modes
appStore.toggleTheme()
```
