<template>
  <div class="weather-page">
    <!-- Header with search and controls -->
    <v-app-bar
      color="primary"
      density="comfortable"
      elevation="2"
    >
      <v-app-bar-title class="text-h6 font-weight-bold">
        <v-icon
          class="mr-2"
          icon="mdi-weather-partly-cloudy"
        />
        Weather App
      </v-app-bar-title>

      <v-spacer />

      <!-- Temperature unit toggle -->
      <v-btn-toggle
        v-model="selectedUnit"
        color="white"
        density="compact"
        mandatory
        variant="outlined"
        @update:model-value="handleUnitChange"
      >
        <v-btn
          size="small"
          value="metric"
        >
          °C
        </v-btn>
        <v-btn
          size="small"
          value="imperial"
        >
          °F
        </v-btn>
      </v-btn-toggle>

      <!-- Theme toggle button -->
      <ThemeToggle class="ml-2" />

      <!-- Refresh button -->
      <v-btn
        class="ml-2"
        icon="mdi-refresh"
        :loading="loading"
        variant="text"
        @click="handleRefresh"
      />
    </v-app-bar>

    <!-- Main content -->
    <v-main class="weather-page__main">
      <v-container
        class="py-6"
        fluid
      >
        <!-- Search section -->
        <v-row class="mb-6">
          <v-col
            cols="12"
            lg="8"
            md="10"
            offset-lg="2"
            offset-md="1"
          >
            <SearchBar
              :loading="searchLoading"
              :location-loading="locationLoading"
              :suggestions="searchSuggestions"
              @input="handleSearchInput"
              @location-search="handleLocationSearch"
              @search="handleSearch"
              @select-location="handleLocationSelect"
            />
          </v-col>
        </v-row>

        <!-- Error message -->
        <v-row v-if="error">
          <v-col
            cols="12"
            lg="8"
            md="10"
            offset-lg="2"
            offset-md="1"
          >
            <v-alert
              class="mb-4"
              color="error"
              icon="mdi-alert-circle"
              :text="error"
              variant="tonal"
            />
          </v-col>
        </v-row>

        <!-- Weather content -->
        <div v-if="currentWeather">
          <v-row>
            <!-- Current weather card -->
            <v-col
              cols="12"
              lg="8"
              md="10"
              offset-lg="2"
              offset-md="1"
            >
              <WeatherCard
                :is-favorite="isFavorite(currentWeather.name)"
                :unit="unit"
                :weather="currentWeather"
                @toggle-favorite="handleToggleFavorite"
              />
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
                :forecast="forecast"
                :loading="forecastLoading"
                :unit="unit"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="!loading"
          class="weather-page__empty"
        >
          <v-row>
            <v-col
              cols="12"
              lg="6"
              md="8"
              offset-lg="3"
              offset-md="2"
            >
              <v-card
                class="text-center pa-8"
                elevation="1"
                rounded="lg"
              >
                <v-icon
                  color="grey-lighten-1"
                  icon="mdi-weather-cloudy"
                  size="80"
                />
                <h2 class="text-h5 font-weight-bold mt-4 mb-2">
                  Welcome to Weather App
                </h2>
                <p class="text-body-1 text-medium-emphasis mb-4">
                  Search for a city to get started, or use your current location
                </p>
                <v-btn
                  color="primary"
                  :loading="locationLoading"
                  prepend-icon="mdi-crosshairs-gps"
                  size="large"
                  variant="elevated"
                  @click="handleLocationSearch"
                >
                  Use My Location
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Favorites section -->
        <div
          v-if="favorites.length > 0"
          class="weather-page__favorites mt-8"
        >
          <v-row>
            <v-col
              cols="12"
              lg="8"
              md="10"
              offset-lg="2"
              offset-md="1"
            >
              <v-card
                elevation="1"
                rounded="lg"
              >
                <v-card-title class="pb-2">
                  <v-icon
                    class="mr-2"
                    icon="mdi-heart"
                  />
                  Favorite Cities
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-list density="compact">
                    <v-list-item
                      v-for="city in favorites"
                      :key="city"
                      :title="city"
                      @click="handleSearch(city)"
                    >
                      <template #prepend>
                        <v-icon icon="mdi-map-marker" />
                      </template>
                      <template #append>
                        <v-btn
                          color="error"
                          icon="mdi-heart-remove"
                          size="small"
                          variant="text"
                          @click.stop="handleRemoveFavorite(city)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
  import type { ForecastData, LocationData, WeatherData } from '@/types/weather'
  import { computed, ref } from 'vue'
  import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
  import SearchBar from '@/components/molecules/SearchBar.vue'
  import WeatherCard from '@/components/molecules/WeatherCard.vue'
  import ForecastList from '@/components/organisms/ForecastList.vue'
  import { TemperatureUnit } from '@/types/weather'

  interface Props {
    currentWeather: WeatherData | null
    forecast: ForecastData | null
    favorites: string[]
    unit: TemperatureUnit
    loading?: boolean
    searchLoading?: boolean
    locationLoading?: boolean
    forecastLoading?: boolean
    error?: string | null
    forecastError?: string | null
    searchSuggestions?: LocationData[]
  }

  interface Emits {
    (e: 'search', query: string): void
    (e: 'location-search'): void
    (e: 'select-location', location: LocationData): void
    (e: 'toggle-favorite', city: string): void
    (e: 'remove-favorite', city: string): void
    (e: 'unit-change', unit: TemperatureUnit): void
    (e: 'refresh'): void
    (e: 'search-input', query: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    searchLoading: false,
    locationLoading: false,
    forecastLoading: false,
    error: null,
    forecastError: null,
    searchSuggestions: () => [],
  })

  const emit = defineEmits<Emits>()

  const selectedUnit = ref(props.unit === TemperatureUnit.CELSIUS ? 'metric' : 'imperial')

  const handleSearch = (query: string) => {
    emit('search', query)
  }

  const handleLocationSearch = () => {
    emit('location-search')
  }

  const handleLocationSelect = (location: LocationData) => {
    emit('select-location', location)
  }

  const handleToggleFavorite = (city: string) => {
    emit('toggle-favorite', city)
  }

  const handleRemoveFavorite = (city: string) => {
    emit('remove-favorite', city)
  }

  const handleUnitChange = (value: string) => {
    const newUnit = value === 'metric' ? TemperatureUnit.CELSIUS : TemperatureUnit.FAHRENHEIT
    emit('unit-change', newUnit)
  }

  const handleRefresh = () => {
    emit('refresh')
  }

  const handleSearchInput = (query: string) => {
    emit('search-input', query)
  }

  const isFavorite = (city: string): boolean => {
    return props.favorites.includes(city)
  }
</script>

<style scoped lang="scss">
  .weather-page {
    min-height: 100vh;

    &__main {
      background: transparent;
    }

    &__empty {
      margin-top: 2rem;
    }

    &__favorites {
      margin-top: 2rem;
    }
  }

  :deep(.v-main__wrap) {
    background: transparent;
  }
</style>
