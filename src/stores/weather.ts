import type { FavoriteLocation, ForecastData, LocationData, WeatherData } from '@/types/weather'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import weatherService from '@/services/weatherService'
import { TemperatureUnit } from '@/types/weather'

export const useWeatherStore = defineStore('weather', () => {
  // State
  const currentWeather = ref<WeatherData | null>(null)
  const forecast = ref<ForecastData | null>(null)
  const favorites = ref<FavoriteLocation[]>([])
  const favoriteWeatherData = ref<WeatherData[]>([])
  const unit = ref<TemperatureUnit>(TemperatureUnit.CELSIUS)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchResults = ref<LocationData[]>([])

  // Helper function to create unique location ID
  const createLocationId = (location: LocationData | FavoriteLocation): string => {
    const name = location.name.toLowerCase().replace(/\s+/g, '-')
    const state = location.state ? location.state.toLowerCase().replace(/\s+/g, '-') : ''
    const country = location.country.toLowerCase().replace(/\s+/g, '-')
    return `${name}-${state ? `${state}-` : ''}${country}-${location.lat.toFixed(4)}-${location.lon.toFixed(4)}`
  }

  // Helper function to create display name for location
  const createLocationDisplayName = (location: FavoriteLocation): string => {
    const parts = [location.name]
    if (location.state) {
      parts.push(location.state)
    }
    parts.push(location.country)
    return parts.join(', ')
  }
  const hasWeatherData = computed(() => currentWeather.value !== null)
  const hasForecastData = computed(() => forecast.value !== null)
  const isLoading = computed(() => loading.value)
  const currentError = computed(() => error.value)
  const currentUnit = computed(() => unit.value)

  // Actions
  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const setUnit = (newUnit: TemperatureUnit) => {
    unit.value = newUnit
    // Refresh favorite weather data with new unit
    if (favorites.value.length > 0) {
      fetchFavoriteWeatherData()
    }
  }

  const fetchCurrentWeather = async (city: string) => {
    try {
      setLoading(true)
      clearError()
      const data = await weatherService.getCurrentWeather(city, unit.value)
      currentWeather.value = data
    } catch (error_) {
      const errorMessage = error_ instanceof Error ? error_.message : 'Failed to fetch weather data'
      setError(errorMessage)
      throw error_
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      clearError()
      const data = await weatherService.getCurrentWeatherByCoords(lat, lon, unit.value)
      currentWeather.value = data
    } catch (error_) {
      const errorMessage = error_ instanceof Error ? error_.message : 'Failed to fetch weather data'
      setError(errorMessage)
      throw error_
    } finally {
      setLoading(false)
    }
  }

  const fetchForecast = async (city: string) => {
    try {
      setLoading(true)
      clearError()
      const data = await weatherService.getForecast(city, unit.value)
      forecast.value = data
    } catch (error_) {
      const errorMessage = error_ instanceof Error ? error_.message : 'Failed to fetch forecast data'
      setError(errorMessage)
      throw error_
    } finally {
      setLoading(false)
    }
  }

  const fetchForecastByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true)
      clearError()
      const data = await weatherService.getForecastByCoords(lat, lon, unit.value)
      forecast.value = data
    } catch (error_) {
      const errorMessage = error_ instanceof Error ? error_.message : 'Failed to fetch forecast data'
      setError(errorMessage)
      throw error_
    } finally {
      setLoading(false)
    }
  }

  const searchLocations = async (query: string) => {
    try {
      setLoading(true)
      clearError()
      const data = await weatherService.searchLocations(query)
      searchResults.value = data
      return data
    } catch (error_) {
      const errorMessage = error_ instanceof Error ? error_.message : 'Failed to search locations'
      setError(errorMessage)
      throw error_
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = async () => {
    try {
      setLoading(true)
      clearError()
      const coords = await weatherService.getCurrentLocation()
      await fetchCurrentWeatherByCoords(coords.lat, coords.lon)
      await fetchForecastByCoords(coords.lat, coords.lon)
      return coords
    } catch (error_) {
      const errorMessage = error_ instanceof Error ? error_.message : 'Failed to get current location'
      setError(errorMessage)
      throw error_
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = (location: LocationData | FavoriteLocation) => {
    const favoriteLocation: FavoriteLocation = {
      name: location.name,
      state: location.state,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      id: createLocationId(location),
    }

    // Check if location is already in favorites using unique ID
    const existingIndex = favorites.value.findIndex(fav => fav.id === favoriteLocation.id)
    if (existingIndex === -1) {
      favorites.value.push(favoriteLocation)
      // Save to localStorage
      localStorage.setItem('weather-favorites', JSON.stringify(favorites.value))
      // Fetch weather data for the new favorite
      fetchFavoriteWeatherData()
    }
  }

  const removeFromFavorites = (locationId: string) => {
    const index = favorites.value.findIndex(fav => fav.id === locationId)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      // Save to localStorage
      localStorage.setItem('weather-favorites', JSON.stringify(favorites.value))
      // Re-fetch favorite weather data to ensure consistency
      fetchFavoriteWeatherData()
    }
  }

  const fetchFavoriteWeatherData = async () => {
    try {
      const weatherPromises = favorites.value.map(favorite =>
        weatherService.getCurrentWeatherByCoords(favorite.lat, favorite.lon, unit.value),
      )
      const results = await Promise.allSettled(weatherPromises)

      // Keep only successful results and maintain order consistency
      const successfulWeatherData: WeatherData[] = []
      for (const [index, result] of results.entries()) {
        if (result.status === 'fulfilled') {
          successfulWeatherData.push(result.value)
        } else {
          console.error(`Failed to fetch weather for favorite: ${favorites.value[index].name}`, result.reason)
        }
      }

      favoriteWeatherData.value = successfulWeatherData
    } catch (error_) {
      console.error('Failed to fetch favorite weather data:', error_)
    }
  }

  const refreshWeatherData = async () => {
    if (currentWeather.value) {
      const city = currentWeather.value.name
      await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ])
    }
  }

  const isFavorite = (location: LocationData | string) => {
    if (typeof location === 'string') {
      // Legacy support - check by city name
      return favorites.value.some(fav => fav.name === location)
    }
    // Check by location ID
    const locationId = createLocationId(location)
    return favorites.value.some(fav => fav.id === locationId)
  }

  const isFavoriteById = (locationId: string) => {
    return favorites.value.some(fav => fav.id === locationId)
  }

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('weather-favorites')
      if (saved) {
        const parsedFavorites = JSON.parse(saved)

        // Handle migration from old string-based favorites to new location-based favorites
        if (Array.isArray(parsedFavorites) && parsedFavorites.length > 0) {
          if (typeof parsedFavorites[0] === 'string') {
            // Old format - migrate to new format by clearing
            console.log('Migrating old favorites format to new format')
            favorites.value = []
            localStorage.removeItem('weather-favorites')
          } else {
            // Deduplicate favorites based on ID to prevent duplicate entries
            const uniqueFavorites = parsedFavorites.reduce((acc: FavoriteLocation[], current: FavoriteLocation) => {
              if (!acc.some(fav => fav.id === current.id)) {
                acc.push(current)
              }
              return acc
            }, [])

            favorites.value = uniqueFavorites

            // Save back if we had duplicates
            if (uniqueFavorites.length !== parsedFavorites.length) {
              console.log('Removed duplicate favorites')
              localStorage.setItem('weather-favorites', JSON.stringify(uniqueFavorites))
            }

            // Load weather data for favorites
            fetchFavoriteWeatherData()
          }
        }
      }
    } catch (error_) {
      console.error('Failed to load favorites from localStorage:', error_)
    }
  }

  // Initialize favorites from localStorage
  loadFavorites()

  return {
    // State
    currentWeather,
    forecast,
    favorites,
    favoriteWeatherData,
    unit,
    loading,
    error,
    searchResults,
    // Getters
    hasWeatherData,
    hasForecastData,
    isLoading,
    currentError,
    currentUnit,
    // Actions
    setLoading,
    setError,
    clearError,
    setUnit,
    fetchCurrentWeather,
    fetchCurrentWeatherByCoords,
    fetchForecast,
    fetchForecastByCoords,
    searchLocations,
    getCurrentLocation,
    addToFavorites,
    removeFromFavorites,
    fetchFavoriteWeatherData,
    isFavorite,
    isFavoriteById,
    loadFavorites,
    refreshWeatherData,
    createLocationId,
    createLocationDisplayName,
  }
})
