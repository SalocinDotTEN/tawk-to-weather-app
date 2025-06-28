<template>
  <div class="weather-detail-page" :class="{ 'theme--dark': isDarkMode }">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
      <p class="mt-4">Loading weather details...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <v-alert
        color="error"
        icon="mdi-alert-circle"
        variant="tonal"
      >
        {{ error }}
      </v-alert>
    </div>

    <!-- Weather details -->
    <div v-else-if="weatherData" class="weather-detail-container">
      <!-- Header Section -->
      <div class="weather-header">
        <!-- Navigation -->
        <div class="navigation">
          <v-btn
            color="white"
            icon="mdi-chevron-left"
            variant="text"
            @click="goBack"
          />
          <h2 class="city-name text-center">{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
          <div class="navigation-actions">
            <v-btn
              class="mr-2"
              color="white"
              :icon="isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              variant="text"
              @click="toggleTheme"
            />
            <v-btn
              color="white"
              :icon="isFavorite ? 'mdi-trash-can-outline' : 'mdi-plus'"
              variant="text"
              @click="toggleFavorite"
            />
          </div>
        </div>

        <!-- Date -->
        <div class="date">
          {{ formatDate(weatherData.dt) }}
        </div>

        <!-- Main weather display -->
        <div class="main-weather">
          <WeatherIcon
            class="weather-icon"
            :description="weatherData.weather[0].description"
            :icon-code="weatherData.weather[0].icon"
            size="4x"
          />

          <div class="temperature">
            {{ Math.round(weatherData.main.temp) }}° C
          </div>

          <div class="condition">
            {{ formatCondition(weatherData.weather[0].description) }}
          </div>

          <div class="last-update">
            Last Update {{ formatTime(weatherData.dt) }}
            <v-btn
              class="refresh-btn ml-2"
              color="white"
              icon="mdi-refresh"
              :loading="refreshLoading"
              size="small"
              variant="text"
              @click="handleRefresh"
            />
          </div>
        </div>
      </div>

      <!-- Content Section -->
      <div class="weather-content">
        <!-- Hourly Forecast -->
        <div class="forecast-section">
          <h3 class="section-title">Hourly Forecast</h3>
          <div v-if="forecastData" class="hourly-forecast justify-center">
            <div
              v-for="(item, index) in getHourlyForecast()"
              :key="index"
              class="hourly-item flex-grow-1 flex-shrink-1"
            >
              <WeatherIcon
                class="hourly-icon"
                :description="item.weather[0].description"
                :icon-code="item.weather[0].icon"
                size="2x"
              />
              <div class="hourly-temp">{{ Math.round(item.main.temp) }}°</div>
              <div class="hourly-time">{{ formatHourlyTime(item.dt) }}</div>
            </div>
          </div>
        </div>

        <!-- Weekly Forecast -->
        <div class="forecast-section">
          <h3 class="section-title">Weekly Forecast</h3>
          <div v-if="forecastData" class="weekly-forecast">
            <div
              v-for="(item, index) in getWeeklyForecast()"
              :key="index"
              class="weekly-item"
            >
              <div class="weekly-left">
                <WeatherIcon
                  class="weekly-icon"
                  :description="item.weather[0].description"
                  :icon-code="item.weather[0].icon"
                  size="2x"
                />
                <div class="weekly-info">
                  <div class="weekly-day">{{ formatWeekDay(item.dt) }}</div>
                  <div class="weekly-condition">{{ formatCondition(item.weather[0].description) }}</div>
                </div>
              </div>
              <div class="weekly-right">
                <div class="weekly-temp">{{ Math.round(item.main.temp) }}° C</div>
                <v-icon icon="mdi-chevron-right" size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ForecastData, TemperatureUnit, WeatherData } from '@/types/weather'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useTheme } from 'vuetify'
  import WeatherIcon from '@/components/atoms/WeatherIcon.vue'
  import { useAppStore } from '@/stores/app'
  import { useWeatherStore } from '@/stores/weather'
  import { TemperatureUnit as TempUnit } from '@/types/weather'

  const route = useRoute()
  const router = useRouter()
  const weatherStore = useWeatherStore()
  const appStore = useAppStore()
  const theme = useTheme()

  const weatherData = ref<WeatherData | null>(null)
  const forecastData = ref<ForecastData | null>(null)
  const loading = ref(false)
  const forecastLoading = ref(false)
  const refreshLoading = ref(false)
  const error = ref<string | null>(null)
  const forecastError = ref<string | null>(null)
  const unit = ref<TemperatureUnit>(TempUnit.CELSIUS)

  const cityName = computed(() => {
    const params = route.params as { city?: string }
    const city = params.city
    return Array.isArray(city) ? city[0] : city || ''
  })

  const isFavorite = computed(() => {
    return weatherStore.favorites.includes(cityName.value)
  })

  const isDarkMode = computed(() => appStore.isDarkMode)

  const fetchWeatherData = async () => {
    try {
      loading.value = true
      error.value = null
      await weatherStore.fetchCurrentWeather(cityName.value)
      weatherData.value = weatherStore.currentWeather
      unit.value = weatherStore.currentUnit
    } catch (error_) {
      error.value = error_ instanceof Error ? error_.message : 'Failed to fetch weather data'
      console.error('Failed to fetch weather data:', error_)
    } finally {
      loading.value = false
    }
  }

  const fetchForecastData = async () => {
    try {
      forecastLoading.value = true
      forecastError.value = null
      await weatherStore.fetchForecast(cityName.value)
      forecastData.value = weatherStore.forecast
    } catch (error_) {
      forecastError.value = error_ instanceof Error ? error_.message : 'Failed to fetch forecast data'
      console.error('Failed to fetch forecast data:', error_)
    } finally {
      forecastLoading.value = false
    }
  }

  const handleRefresh = async () => {
    try {
      refreshLoading.value = true
      await Promise.all([
        fetchWeatherData(),
        fetchForecastData(),
      ])
    } catch (error_) {
      console.error('Refresh failed:', error_)
    } finally {
      refreshLoading.value = false
    }
  }

  const toggleFavorite = () => {
    if (isFavorite.value) {
      weatherStore.removeFromFavorites(cityName.value)
    } else {
      weatherStore.addToFavorites(cityName.value)
    }
  }

  const toggleTheme = () => {
    appStore.toggleTheme()
    theme.global.name.value = appStore.isDarkMode ? 'dark' : 'light'
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatHourlyTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatWeekDay = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
    })
  }

  const formatCondition = (description: string): string => {
    return description.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1),
    ).join(' ')
  }

  const getHourlyForecast = () => {
    if (!forecastData.value?.list) return []
    return forecastData.value.list.slice(0, 4)
  }

  const getWeeklyForecast = () => {
    if (!forecastData.value?.list) return []
    // Get one forecast per day (every 8th item since API returns 3-hour intervals)
    const dailyForecasts = []
    for (let i = 0; i < forecastData.value.list.length; i += 8) {
      dailyForecasts.push(forecastData.value.list[i])
      if (dailyForecasts.length >= 4) break
    }
    return dailyForecasts
  }

  const goBack = () => {
    router.back()
  }

  onMounted(async () => {
    await Promise.all([
      fetchWeatherData(),
      fetchForecastData(),
    ])
  })
</script>

<style scoped lang="scss">
  .weather-detail-page {
    min-height: 100vh;
    background: #f5f5f5;
    transition: background-color 0.3s ease;
  }

  .theme--dark .weather-detail-page {
    background: #121212;
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }

  .weather-detail-container {
    min-height: 100vh;
  }

  .weather-header {
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: white;
    padding: 0 1rem 2rem;
    position: relative;
  }

  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .status-icons {
    display: flex;
    gap: 0.25rem;
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    position: relative;
  }

  .navigation-actions {
    display: flex;
    align-items: center;
  }

  .city-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    max-width: calc(100% - 140px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    pointer-events: none;
  }

  .date {
    text-align: center;
    font-size: 0.95rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }

  .main-weather {
    text-align: center;
    padding-bottom: 1rem;
  }

  .weather-icon {
    margin-bottom: 1rem;
  }

  .temperature {
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }

  .condition {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }

  .last-update {
    font-size: 0.9rem;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .refresh-btn {
    opacity: 0.8;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }

  .weather-content {
    background: white;
    border-radius: 1rem 1rem 0 0;
    margin-top: -1rem;
    position: relative;
    z-index: 1;
    padding: 1.5rem;
    transition: background-color 0.3s ease;
  }

  .theme--dark .weather-content {
    background: #1e1e1e;
  }

  .forecast-section {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 1rem;
    transition: color 0.3s ease;
  }

  .theme--dark .section-title {
    color: #e0e0e0;
  }

  .hourly-forecast {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 0.5rem 0;
  }

  .hourly-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
    padding: 1rem 0.5rem;
    background: #f8f9fa;
    border-radius: 1rem;
    text-align: center;
    transition: background-color 0.3s ease;
  }

  .theme--dark .hourly-item {
    background: #2a2a2a;
  }

  .hourly-icon {
    margin-bottom: 0.5rem;
  }

  .hourly-temp {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.25rem;
    transition: color 0.3s ease;
  }

  .theme--dark .hourly-temp {
    color: #e0e0e0;
  }

  .hourly-time {
    font-size: 0.8rem;
    color: #666;
    transition: color 0.3s ease;
  }

  .theme--dark .hourly-time {
    color: #a0a0a0;
  }

  .weekly-forecast {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .weekly-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #D2DFFF;
    border-radius: 1rem;
    transition: background-color 0.3s ease;
  }

  .theme--dark .weekly-item {
    background: #2a2a3a;
  }

  .weekly-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .weekly-icon {
    flex-shrink: 0;
    background-color: #98B4FD;
    border-radius: 50%;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    transition: background-color 0.3s ease;
  }

  .theme--dark .weekly-icon {
    background-color: #7A9BFF;
  }

  .weekly-info {
    display: flex;
    flex-direction: column;
  }

  .weekly-day {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    transition: color 0.3s ease;
  }

  .theme--dark .weekly-day {
    color: #e0e0e0;
  }

  .weekly-condition {
    font-size: 0.9rem;
    color: #666;
    transition: color 0.3s ease;
  }

  .theme--dark .weekly-condition {
    color: #a0a0a0;
  }

  .weekly-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .weekly-temp {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    transition: color 0.3s ease;
  }

  .theme--dark .weekly-temp {
    color: #e0e0e0;
  }

  // Mobile responsiveness
  @media (max-width: 600px) {
    .weather-header {
      padding: 0 1rem 1.5rem;
    }

    .city-name {
      font-size: 1rem;
      max-width: calc(100% - 120px);
    }

    .temperature {
      font-size: 2.5rem;
    }

    .hourly-forecast {
      gap: 0.5rem;
    }

  }
</style>
