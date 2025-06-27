<template>
  <v-card
    class="weather-card"
    :class="weatherConditionClass"
    elevation="2"
    rounded="xl"
  >
    <v-card-text class="pa-4">
      <div class="weather-card__header">
        <div class="weather-card__location">
          <h3 class="text-h6 font-weight-bold">
            {{ weather.name }}
          </h3>
          <p class="text-caption text-medium-emphasis">
            {{ weather.sys.country }}
          </p>
        </div>
        <v-btn
          :color="isFavorite ? 'error' : 'white'"
          :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
          size="small"
          variant="text"
          @click="toggleFavorite"
        />
      </div>

      <div class="weather-card__main">
        <div class="weather-card__temperature">
          <TemperatureDisplay
            size="large"
            :temperature="weather.main.temp"
            :unit="unit"
          />
          <div class="weather-card__feels-like">
            <span class="text-caption text-medium-emphasis">
              Feels like
            </span>
            <TemperatureDisplay
              size="small"
              :temperature="weather.main.feels_like"
              :unit="unit"
              variant="muted"
            />
          </div>
        </div>

        <div class="weather-card__icon">
          <WeatherIcon
            :description="weather.weather[0].description"
            :icon-code="weather.weather[0].icon"
            size="4x"
          />
          <p class="text-body-2 text-center text-capitalize mt-2">
            {{ weather.weather[0].description }}
          </p>
        </div>
      </div>

      <v-divider class="my-4" />

      <div class="weather-card__details">
        <v-row dense>
          <v-col
            cols="6"
            sm="3"
          >
            <div class="weather-card__detail">
              <v-icon
                icon="mdi-thermometer-high"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption font-weight-medium">
                  High
                </p>
                <TemperatureDisplay
                  :temperature="weather.main.temp_max"
                  :unit="unit"
                  size="small"
                  variant="strong"
                />
              </div>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="3"
          >
            <div class="weather-card__detail">
              <v-icon
                icon="mdi-thermometer-low"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption font-weight-medium">
                  Low
                </p>
                <TemperatureDisplay
                  :temperature="weather.main.temp_min"
                  :unit="unit"
                  size="small"
                  variant="strong"
                />
              </div>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="3"
          >
            <div class="weather-card__detail">
              <v-icon
                icon="mdi-water-percent"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption font-weight-medium">
                  Humidity
                </p>
                <p class="text-body-2 font-weight-bold">
                  {{ weather.main.humidity }}%
                </p>
              </div>
            </div>
          </v-col>

          <v-col
            cols="6"
            sm="3"
          >
            <div class="weather-card__detail">
              <v-icon
                icon="mdi-weather-windy"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption font-weight-medium">
                  Wind
                </p>
                <p class="text-body-2 font-weight-bold">
                  {{ weather.wind.speed.toFixed(1) }} m/s
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <div class="weather-card__footer mt-4">
        <p class="text-caption text-medium-emphasis">
          Last updated: {{ formatTime(weather.dt) }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { TemperatureUnit, WeatherData } from '@/types/weather'
  import TemperatureDisplay from '@/components/atoms/TemperatureDisplay.vue'
  import WeatherIcon from '@/components/atoms/WeatherIcon.vue'

  interface Props {
    weather: WeatherData
    unit: TemperatureUnit
    isFavorite?: boolean
  }

  interface Emits {
    (e: 'toggle-favorite', city: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    isFavorite: false,
  })

  const emit = defineEmits<Emits>()

  const weatherConditionClass = computed(() => {
    if (!props.weather.weather || props.weather.weather.length === 0) {
      return ''
    }
    const icon = props.weather.weather[0].icon.slice(0, 2)
    switch (icon) {
      case '01': {
        return 'weather-card--clear'
      }
      case '02':
      case '03':
      case '04': {
        return 'weather-card--cloudy'
      }
      case '09':
      case '10': {
        return 'weather-card--rainy'
      }
      case '11': {
        return 'weather-card--stormy'
      }
      case '13': {
        return 'weather-card--snowy'
      }
      case '50': {
        return 'weather-card--misty'
      }
      default: {
        return ''
      }
    }
  })

  const toggleFavorite = () => {
    emit('toggle-favorite', props.weather.name)
  }

  const formatTime = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<style scoped lang="scss">
  .weather-card {
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

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    &__location {
      flex: 1;
    }

    &__main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    &__temperature {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    &__feels-like {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    &__icon {
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
    }

    &__footer {
      text-align: center;
    }
  }

  // Theme adjustments for dark text on light cloudy background
  .weather-card--cloudy {
    .text-medium-emphasis {
      color: rgba(0, 0, 0, 0.6) !important;
    }
    .v-icon {
      color: #333 !important;
    }
  }

  // Theme adjustments for light text on dark backgrounds
  .weather-card--clear,
  .weather-card--rainy,
  .weather-card--stormy,
  .weather-card--snowy,
  .weather-card--misty {
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

  @media (max-width: 600px) {
    .weather-card {
      &__main {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      &__temperature {
        align-items: center;
      }
    }
  }
</style>
