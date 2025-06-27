<template>
  <v-card
    class="forecast-list"
    elevation="1"
    rounded="lg"
  >
    <v-card-title class="pb-2">
      <v-icon
        class="mr-2"
        icon="mdi-calendar-week"
      />
      5-Day Forecast
    </v-card-title>

    <v-card-text class="pa-0">
      <LoadingSpinner
        v-if="loading"
        :centered="true"
        text="Loading forecast..."
      />

      <v-alert
        v-else-if="error"
        class="ma-4"
        color="error"
        icon="mdi-alert-circle"
        variant="tonal"
      >
        {{ error }}
      </v-alert>

      <div
        v-else-if="forecast"
        class="forecast-list__items"
      >
        <div
          v-for="(item, index) in dailyForecast"
          :key="index"
          class="forecast-list__item"
        >
          <div class="forecast-list__date">
            <p class="text-body-2 font-weight-medium">
              {{ formatDate(item.dt) }}
            </p>
            <p class="text-caption text-medium-emphasis">
              {{ formatDay(item.dt) }}
            </p>
          </div>

          <div class="forecast-list__weather">
            <WeatherIcon
              :description="item.weather[0].description"
              :icon-code="item.weather[0].icon"
              size="2x"
            />
            <p class="text-caption text-center text-capitalize mt-1">
              {{ item.weather[0].main }}
            </p>
          </div>

          <div class="forecast-list__temperature">
            <div class="forecast-list__temp-range">
              <TemperatureDisplay
                size="small"
                :temperature="item.main.temp_max"
                :unit="unit"
                variant="primary"
              />
              <span class="text-caption text-medium-emphasis mx-1">/</span>
              <TemperatureDisplay
                size="small"
                :temperature="item.main.temp_min"
                :unit="unit"
                variant="muted"
              />
            </div>
          </div>

          <div class="forecast-list__details">
            <div class="forecast-list__detail">
              <v-icon
                color="info"
                icon="mdi-water-percent"
                size="x-small"
              />
              <span class="text-caption ml-1">{{ item.main.humidity }}%</span>
            </div>
            <div class="forecast-list__detail">
              <v-icon
                color="success"
                icon="mdi-weather-windy"
                size="x-small"
              />
              <span class="text-caption ml-1">{{ Math.round(item.wind.speed) }} m/s</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="forecast-list__empty"
      >
        <v-icon
          color="grey"
          icon="mdi-weather-cloudy"
          size="48"
        />
        <p class="text-body-2 text-medium-emphasis mt-2">
          No forecast data available
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { ForecastData, ForecastItem, TemperatureUnit } from '@/types/weather'
  import { computed } from 'vue'
  import LoadingSpinner from '@/components/atoms/LoadingSpinner.vue'
  import TemperatureDisplay from '@/components/atoms/TemperatureDisplay.vue'
  import WeatherIcon from '@/components/atoms/WeatherIcon.vue'

  interface Props {
    forecast: ForecastData | null
    unit: TemperatureUnit
    loading?: boolean
    error?: string | null
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    error: null,
  })

  // Group forecast items by day and get one item per day
  const dailyForecast = computed(() => {
    if (!props.forecast) return []

    const dailyItems: ForecastItem[] = []
    const seenDates = new Set<string>()

    for (const item of props.forecast.list) {
      const date = new Date(item.dt * 1000).toDateString()
      if (!seenDates.has(date)) {
        seenDates.add(date)
        dailyItems.push(item)
        if (dailyItems.length >= 5) break
      }
    }

    return dailyItems
  })

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDay = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString([], { weekday: 'short' })
    }
  }
</script>

<style scoped lang="scss">
  .forecast-list {
    &__items {
      display: flex;
      flex-direction: column;
    }

    &__item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid rgb(var(--v-theme-outline-variant));

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: rgb(var(--v-theme-surface-variant));
      }
    }

    &__date {
      flex: 0 0 80px;
      text-align: left;
    }

    &__weather {
      flex: 0 0 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__temperature {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    &__temp-range {
      display: flex;
      align-items: center;
    }

    &__details {
      flex: 0 0 100px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    &__detail {
      display: flex;
      align-items: center;
    }

    &__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    .forecast-list {
      &__item {
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      &__date {
        flex: 1 1 50%;
      }

      &__weather {
        flex: 1 1 50%;
      }

      &__temperature {
        flex: 1 1 50%;
        justify-content: flex-start;
      }

      &__details {
        flex: 1 1 50%;
        flex-direction: row;
        gap: 1rem;
      }
    }
  }
</style>
