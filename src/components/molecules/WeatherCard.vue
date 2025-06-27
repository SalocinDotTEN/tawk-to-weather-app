<template>
  <v-card
    class="weather-card"
    elevation="2"
    rounded="lg"
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
          :color="isFavorite ? 'error' : 'grey'"
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
                color="primary"
                icon="mdi-thermometer-high"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption text-medium-emphasis">
                  High
                </p>
                <TemperatureDisplay
                  size="small"
                  :temperature="weather.main.temp_max"
                  :unit="unit"
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
                color="info"
                icon="mdi-thermometer-low"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption text-medium-emphasis">
                  Low
                </p>
                <TemperatureDisplay
                  size="small"
                  :temperature="weather.main.temp_min"
                  :unit="unit"
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
                color="secondary"
                icon="mdi-water-percent"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption text-medium-emphasis">
                  Humidity
                </p>
                <p class="text-body-2 font-weight-medium">
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
                color="success"
                icon="mdi-weather-windy"
                size="small"
              />
              <div class="ml-2">
                <p class="text-caption text-medium-emphasis">
                  Wind
                </p>
                <p class="text-body-2 font-weight-medium">
                  {{ Math.round(weather.wind.speed) }} m/s
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
