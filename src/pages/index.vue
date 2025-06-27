<template>
  <WeatherPageTemplate
    :current-weather="weatherStore.currentWeather"
    :error="weatherStore.currentError"
    :favorites="weatherStore.favorites"
    :loading="weatherStore.isLoading"
    :location-loading="locationLoading"
    :search-loading="searchLoading"
    :search-suggestions="searchSuggestions"
    :unit="weatherStore.currentUnit"
    @location-search="handleLocationSearch"
    @refresh="handleRefresh"
    @remove-favorite="handleRemoveFavorite"
    @search="handleSearch"
    @search-input="handleSearchInput"
    @select-location="handleLocationSelect"
    @toggle-favorite="handleToggleFavorite"
    @unit-change="handleUnitChange"
  />
</template>

<script setup lang="ts">
  import type { LocationData, TemperatureUnit } from '@/types/weather'
  import { onMounted, ref } from 'vue'
  import WeatherPageTemplate from '@/components/templates/WeatherPageTemplate.vue'
  import { useWeatherStore } from '@/stores/weather'

  const weatherStore = useWeatherStore()

  // Local state for additional loading states
  const searchLoading = ref(false)
  const locationLoading = ref(false)
  const searchSuggestions = ref<LocationData[]>([])
  const searchTimeout = ref<number | null>(null)

  const handleSearch = async (query: string) => {
    try {
      searchLoading.value = true
      await weatherStore.fetchCurrentWeather(query)
      // Clear search suggestions after successful search
      searchSuggestions.value = []
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      searchLoading.value = false
    }
  }

  const handleLocationSearch = async () => {
    try {
      locationLoading.value = true
      await weatherStore.getCurrentLocation()
    } catch (error) {
      console.error('Location search failed:', error)
    } finally {
      locationLoading.value = false
    }
  }

  const handleLocationSelect = async (location: LocationData) => {
    try {
      searchLoading.value = true
      await weatherStore.fetchCurrentWeatherByCoords(location.lat, location.lon)
      // Clear search suggestions after selection
      searchSuggestions.value = []
    } catch (error) {
      console.error('Location select failed:', error)
    } finally {
      searchLoading.value = false
    }
  }

  const handleToggleFavorite = (city: string) => {
    if (weatherStore.isFavorite(city)) {
      weatherStore.removeFromFavorites(city)
    } else {
      weatherStore.addToFavorites(city)
    }
  }

  const handleRemoveFavorite = (city: string) => {
    weatherStore.removeFromFavorites(city)
  }

  const handleUnitChange = async (unit: TemperatureUnit) => {
    weatherStore.setUnit(unit)
    // Refresh current weather data with new unit
    if (weatherStore.currentWeather) {
      await handleRefresh()
    }
  }

  const handleRefresh = async () => {
    try {
      await weatherStore.refreshWeatherData()
    } catch (error) {
      console.error('Refresh failed:', error)
    }
  }

  const handleSearchInput = async (query: string) => {
    // Clear previous timeout
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }

    // Clear suggestions if query is too short
    if (query.length < 2) {
      searchSuggestions.value = []
      return
    }

    // Debounce search suggestions
    searchTimeout.value = setTimeout(async () => {
      try {
        const suggestions = await weatherStore.searchLocations(query)
        searchSuggestions.value = suggestions.slice(0, 5) // Limit to 5 suggestions
      } catch (error) {
        console.error('Search suggestions failed:', error)
        searchSuggestions.value = []
      }
    }, 300)
  }

  // Initialize with user's location on mount
  onMounted(async () => {
    try {
      // Try to get user's current location
      await handleLocationSearch()
    } catch (error) {
      // Silently fail - user can search manually
      console.log('Could not get initial location:', error)
    }
  })
</script>
