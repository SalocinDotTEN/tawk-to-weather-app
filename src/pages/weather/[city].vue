<template>
  <div class="weather-detail-page">
    <v-main class="pt-16">
      <v-container>
        <!-- Back button -->
        <v-row class="mb-4">
          <v-col cols="12">
            <v-btn
              prepend-icon="mdi-arrow-left"
              variant="text"
              @click="goBack"
            >
              Back
            </v-btn>
          </v-col>
        </v-row>

        <!-- Loading state -->
        <div v-if="loading" class="text-center">
          <v-progress-circular
            color="primary"
            indeterminate
            size="64"
          />
          <p class="mt-4">Loading weather details...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center">
          <v-alert
            color="error"
            icon="mdi-alert-circle"
            variant="tonal"
          >
            {{ error }}
          </v-alert>
        </div>

        <!-- Weather details -->
        <div v-else-if="weatherData">
          <v-row>
            <v-col
              cols="12"
              lg="8"
              md="10"
              offset-lg="2"
              offset-md="1"
            >
              <!-- Main weather card with full details -->
              <v-card
                class="weather-detail-card"
                :class="weatherConditionClass"
                elevation="4"
                rounded="xl"
              >
                <v-card-text class="pa-6">
                  <!-- Header -->
                  <div class="weather-detail__header">
                    <div class="weather-detail__location">
                      <h1 class="text-h4 font-weight-bold">
                        {{ weatherData.name }}
                      </h1>
                      <p class="text-h6 text-medium-emphasis">
                        {{ weatherData.sys.country }}
                      </p>
                    </div>
                    <v-btn
                      :color="isFavorite ? 'error' : 'white'"
                      :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                      size="large"
                      variant="text"
                      @click="toggleFavorite"
                    />
                  </div>

                  <!-- Main weather display -->
                  <div class="weather-detail__main mt-6">
                    <div class="weather-detail__temperature-section">
                      <TemperatureDisplay
                        size="xl"
                        :temperature="weatherData.main.temp"
                        :unit="unit"
                      />
                      <div class="weather-detail__feels-like mt-2">
                        <span class="text-h6 text-medium-emphasis">
                          Feels like
                        </span>
                        <TemperatureDisplay
                          size="medium"
                          :temperature="weatherData.main.feels_like"
                          :unit="unit"
                          variant="muted"
                        />
                      </div>
                    </div>

                    <div class="weather-detail__icon-section">
                      <WeatherIcon
                        :description="weatherData.weather[0].description"
                        :icon-code="weatherData.weather[0].icon"
                        size="4x"
                      />
                      <p class="text-h6 text-center text-capitalize mt-3">
                        {{ weatherData.weather[0].description }}
                      </p>
                    </div>
                  </div>

                  <v-divider class="my-6" />

                  <!-- Detailed weather information -->
                  <div class="weather-detail__details">
                    <v-row>
                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-thermometer-high"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              High
                            </p>
                            <TemperatureDisplay
                              size="medium"
                              :temperature="weatherData.main.temp_max"
                              :unit="unit"
                              variant="strong"
                            />
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-thermometer-low"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Low
                            </p>
                            <TemperatureDisplay
                              size="medium"
                              :temperature="weatherData.main.temp_min"
                              :unit="unit"
                              variant="strong"
                            />
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-water-percent"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Humidity
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ weatherData.main.humidity }}%
                            </p>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-weather-windy"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Wind
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ weatherData.wind.speed.toFixed(1) }} m/s
                            </p>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-gauge"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Pressure
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ weatherData.main.pressure }} hPa
                            </p>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-eye"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Visibility
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ (weatherData.visibility / 1000).toFixed(1) }} km
                            </p>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-weather-sunny"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              UV Index
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ uvIndex }}
                            </p>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6" md="3" sm="4">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-cloud"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Cloudiness
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ weatherData.clouds.all }}%
                            </p>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Sun times -->
                  <v-divider class="my-6" />

                  <div class="weather-detail__sun-times">
                    <v-row>
                      <v-col cols="6">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-weather-sunset-up"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Sunrise
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ formatTime(weatherData.sys.sunrise) }}
                            </p>
                          </div>
                        </div>
                      </v-col>

                      <v-col cols="6">
                        <div class="weather-detail__detail">
                          <v-icon
                            icon="mdi-weather-sunset-down"
                            size="large"
                          />
                          <div class="ml-3">
                            <p class="text-body-1 font-weight-medium">
                              Sunset
                            </p>
                            <p class="text-h6 font-weight-bold">
                              {{ formatTime(weatherData.sys.sunset) }}
                            </p>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>

                  <!-- Footer -->
                  <div class="weather-detail__footer mt-6 text-center">
                    <p class="text-body-1 text-medium-emphasis">
                      Last updated: {{ formatTime(weatherData.dt) }}
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Forecast section -->
          <v-row class="mt-6">
            <v-col
              cols="12"
              lg="8"
              md="10"
              offset-lg="2"
              offset-md="1"
            >
              <ForecastList
                :error="forecastError"
                :forecast="forecastData"
                :loading="forecastLoading"
                :unit="unit"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
  import type { ForecastData, TemperatureUnit, WeatherData } from '@/types/weather'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import TemperatureDisplay from '@/components/atoms/TemperatureDisplay.vue'
  import WeatherIcon from '@/components/atoms/WeatherIcon.vue'
  import ForecastList from '@/components/organisms/ForecastList.vue'
  import { useWeatherStore } from '@/stores/weather'
  import { TemperatureUnit as TempUnit } from '@/types/weather'

  const route = useRoute()
  const router = useRouter()
  const weatherStore = useWeatherStore()

  const weatherData = ref<WeatherData | null>(null)
  const forecastData = ref<ForecastData | null>(null)
  const loading = ref(false)
  const forecastLoading = ref(false)
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

  const weatherConditionClass = computed(() => {
    if (!weatherData.value?.weather || weatherData.value.weather.length === 0) {
      return ''
    }
    const icon = weatherData.value.weather[0].icon.slice(0, 2)
    switch (icon) {
      case '01': {
        return 'weather-detail-card--clear'
      }
      case '02':
      case '03':
      case '04': {
        return 'weather-detail-card--cloudy'
      }
      case '09':
      case '10': {
        return 'weather-detail-card--rainy'
      }
      case '11': {
        return 'weather-detail-card--stormy'
      }
      case '13': {
        return 'weather-detail-card--snowy'
      }
      case '50': {
        return 'weather-detail-card--misty'
      }
      default: {
        return ''
      }
    }
  })

  const uvIndex = computed(() => {
    // This would typically come from an additional API call
    // For now, we'll estimate based on time and weather conditions
    return '5' // Placeholder value
  })

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

  const toggleFavorite = () => {
    if (isFavorite.value) {
      weatherStore.removeFromFavorites(cityName.value)
    } else {
      weatherStore.addToFavorites(cityName.value)
    }
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
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
  .weather-detail-card {
    transition: all 0.3s ease-in-out;

    &--clear {
      background: linear-gradient(45deg, #2980b9, #6dd5fa);
      color: white;
    }

    &--cloudy {
      background: linear-gradient(45deg, #757f9a, #d7dde8);
      color: #333;
    }

    &--rainy {
      background: linear-gradient(45deg, #00416a, #799f0c, #e4e5e6);
      color: white;
    }

    &--stormy {
      background: linear-gradient(45deg, #141e30, #243b55);
      color: white;
    }

    &--snowy {
      background: linear-gradient(45deg, #e6dada, #274046);
      color: white;
    }

    &--misty {
      background: linear-gradient(45deg, #606c88, #3f4c6b);
      color: white;
    }
  }

  .weather-detail {
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    &__location {
      flex: 1;
    }

    &__main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }

    &__temperature-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    &__feels-like {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__icon-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__details {
      margin-top: 1rem;
    }

    &__detail {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    &__sun-times {
      margin-top: 1rem;
    }

    &__footer {
      margin-top: 2rem;
    }
  }

  // Theme adjustments for dark text on light cloudy background
  .weather-detail-card--cloudy {
    .text-medium-emphasis {
      color: rgba(0, 0, 0, 0.6) !important;
    }
    .v-icon {
      color: #333 !important;
    }
  }

  // Theme adjustments for light text on dark backgrounds
  .weather-detail-card--clear,
  .weather-detail-card--rainy,
  .weather-detail-card--stormy,
  .weather-detail-card--snowy,
  .weather-detail-card--misty {
    .text-medium-emphasis {
      color: rgba(255, 255, 255, 0.7) !important;
    }
    .v-icon {
      color: white !important;
    }
    .v-divider {
      border-color: rgba(255, 255, 255, 0.12);
    }
  }

  @media (max-width: 900px) {
    .weather-detail__main {
      flex-direction: column;
      gap: 2rem;
      text-align: center;
    }

    .weather-detail__temperature-section {
      align-items: center;
    }
  }
</style>
