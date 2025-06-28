import type { ForecastData, LocationData, WeatherData } from '@/types/weather'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import weatherService from '@/services/weatherService'
import { TemperatureUnit } from '@/types/weather'

export const useWeatherStore = defineStore('weather', () => {
  // State
  const currentWeather = ref<WeatherData | null>(null)
  const forecast = ref<ForecastData | null>(null)
  const favorites = ref<string[]>([])
  const favoriteWeatherData = ref<WeatherData[]>([])
  const unit = ref<TemperatureUnit>(TemperatureUnit.CELSIUS)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchResults = ref<LocationData[]>([])

  // Getters
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

  const addToFavorites = (city: string) => {
    if (!favorites.value.includes(city)) {
      favorites.value.push(city)
      // Save to localStorage
      localStorage.setItem('weather-favorites', JSON.stringify(favorites.value))
      // Fetch weather data for the new favorite
      fetchFavoriteWeatherData()
    }
  }

  const removeFromFavorites = (city: string) => {
    const index = favorites.value.indexOf(city)
    if (index !== -1) {
      favorites.value.splice(index, 1)
      // Remove from favorite weather data
      favoriteWeatherData.value = favoriteWeatherData.value.filter(weather => weather.name !== city)
      // Save to localStorage
      localStorage.setItem('weather-favorites', JSON.stringify(favorites.value))
    }
  }

  const fetchFavoriteWeatherData = async () => {
    try {
      const weatherPromises = favorites.value.map(city =>
        weatherService.getCurrentWeather(city, unit.value),
      )
      const results = await Promise.allSettled(weatherPromises)

      favoriteWeatherData.value = results
        .filter((result): result is PromiseFulfilledResult<WeatherData> =>
          result.status === 'fulfilled',
        )
        .map(result => result.value)
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

  const isFavorite = (city: string) => {
    return favorites.value.includes(city)
  }

  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('weather-favorites')
      if (saved) {
        favorites.value = JSON.parse(saved)
        // Load weather data for favorites
        fetchFavoriteWeatherData()
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
    loadFavorites,
    refreshWeatherData,
  }
})
