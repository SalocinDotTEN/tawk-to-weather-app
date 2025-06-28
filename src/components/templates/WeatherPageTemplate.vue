<template>
  <div class="weather-page">
    <!-- Main content -->
    <v-main class="weather-page__main">
      <v-container class="py-6" fluid>
        <v-row class="mb-4">
          <v-col
            cols="6"
            lg="6"
            md="12"
          >
            <h1 class="text-h4 font-weight-bold"> Weather </h1>
          </v-col>
          <v-col
            class="text-right"
            cols="6"
            lg="6"
            md="12"
          >
            <!-- Theme toggle button -->
            <ThemeToggle class="ml-2" />
            <!-- Temperature unit toggle -->
            <v-btn-toggle
              v-model="selectedUnit"
              color="primary"
              density="compact"
              mandatory
              variant="outlined"
              @update:model-value="handleUnitChange"
            >
              <v-btn size="small" value="metric"> °C </v-btn>
              <v-btn size="small" value="imperial"> °F </v-btn>
            </v-btn-toggle>
            <v-btn
              class="ml-2"
              icon="mdi-refresh"
              :loading="loading"
              variant="text"
              @click="handleRefresh"
            />
          </v-col>
        </v-row>
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
                :show-favorite-button="false"
                :unit="unit"
                :weather="currentWeather"
                @toggle-favorite="handleToggleFavorite"
              />
            </v-col>
          </v-row>
        </div>
        <!-- Empty state -->
        <div v-else-if="!loading" class="weather-page__empty">
          <v-row>
            <v-col
              cols="12"
              lg="6"
              md="8"
              offset-lg="3"
              offset-md="2"
            >
              <v-card class="text-center pa-8" elevation="1" rounded="lg">
                <v-icon color="grey-lighten-1" icon="mdi-weather-cloudy" size="80" />
                <h2 class="text-h5 font-weight-bold mt-4 mb-2"> Welcome to Weather App </h2>
                <p class="text-body-1 text-medium-emphasis mb-4"> Search for a city to get started, or use your current
                  location </p>
                <v-btn
                  color="primary"
                  :loading="locationLoading"
                  prepend-icon="mdi-crosshairs-gps"
                  size="large"
                  variant="elevated"
                  @click="handleLocationSearch"
                > Use My Location </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <!-- Favorites section -->
        <div v-if="favoriteWeatherData.length > 0" class="weather-page__favorites mt-8">
          <v-row>
            <v-col cols="12">
              <h2 class="text-h5 font-weight-bold mb-4">
                <v-icon
                  class="mr-2"
                  color="error"
                  icon="mdi-heart"
                />
                Favorite Cities
              </h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="weatherData in favoriteWeatherData"
              :key="weatherData.name"
              cols="12"
              lg="4"
              sm="6"
            >
              <WeatherCard
                :is-favorite="true"
                :unit="unit"
                :weather="weatherData"
                @toggle-favorite="handleRemoveFavorite"
              />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
  import type { LocationData, WeatherData } from '@/types/weather'
  import { ref } from 'vue'
  import ThemeToggle from '@/components/atoms/ThemeToggle.vue'
  import SearchBar from '@/components/molecules/SearchBar.vue'
  import WeatherCard from '@/components/molecules/WeatherCard.vue'
  import { TemperatureUnit } from '@/types/weather'

  interface Props {
    currentWeather: WeatherData | null
    favorites: string[]
    favoriteWeatherData?: WeatherData[]
    unit: TemperatureUnit
    loading?: boolean
    searchLoading?: boolean
    locationLoading?: boolean
    error?: string | null
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
    error: null,
    searchSuggestions: () => [],
    favoriteWeatherData: () => [],
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
