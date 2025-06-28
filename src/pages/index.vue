<template>
  <WeatherPageTemplate
    :current-weather="weatherStore.currentWeather"
    :error="weatherStore.currentError"
    :favorite-weather-data="weatherStore.favoriteWeatherData"
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
  import { useRouter } from 'vue-router'
  import WeatherPageTemplate from '@/components/templates/WeatherPageTemplate.vue'
  import { useWeatherStore } from '@/stores/weather'

  const weatherStore = useWeatherStore()
  const router = useRouter()

  // Local state for additional loading states
  const searchLoading = ref(false)
  const locationLoading = ref(false)
  const searchSuggestions = ref<LocationData[]>([])
  const searchTimeout = ref<number | null>(null)

  const navigateToWeatherDetail = async (cityName: string, coords?: { lat: number, lon: number }) => {
    const path = coords
      ? `/weather/${encodeURIComponent(cityName)}?lat=${coords.lat}&lon=${coords.lon}`
      : `/weather/${encodeURIComponent(cityName)}`
    await router.push(path)
  }

  const handleSearch = async (query: string) => {
    try {
      searchLoading.value = true
      // Navigate to weather detail page instead of fetching weather data
      await navigateToWeatherDetail(query)
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
      // Navigate to weather detail page with coordinates for precise location
      await navigateToWeatherDetail(location.name, { lat: location.lat, lon: location.lon })
      // Clear search suggestions after selection
      searchSuggestions.value = []
    } catch (error) {
      console.error('Location select failed:', error)
    } finally {
      searchLoading.value = false
    }
  }

  const handleToggleFavorite = (location: LocationData) => {
    if (weatherStore.isFavorite(location)) {
      const locationId = weatherStore.createLocationId(location)
      weatherStore.removeFromFavorites(locationId)
    } else {
      weatherStore.addToFavorites(location)
    }
  }

  const handleRemoveFavorite = (locationId: string) => {
    weatherStore.removeFromFavorites(locationId)
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
