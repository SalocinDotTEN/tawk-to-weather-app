<template>
  <v-card
    class="weather-card"
    :class="weatherConditionClass"
    elevation="2"
    rounded="xl"
    @click="navigateToDetails"
  >
    <v-card-text class="pa-4">
      <div class="weather-card__content">
        <!-- Left side: Location -->
        <div class="weather-card__location">
          <h3 class="text-h6 font-weight-bold">
            {{ weather.name }}
          </h3>
          <p class="text-caption text-medium-emphasis">
            {{ weather.sys.country }}
          </p>
        </div>

        <!-- Right side: Temperature and Icon -->
        <div class="weather-card__temperature-section">
          <!-- Large temperature display -->
          <div class="weather-card__temperature">
            <TemperatureDisplay
              size="xl"
              :temperature="weather.main.temp"
              :unit="unit"
            />
          </div>
          
          <!-- Weather icon below temperature -->
          <div class="weather-card__icon">
            <WeatherIcon
              :description="weather.weather[0].description"
              :icon-code="weather.weather[0].icon"
              size="2x"
            />
          </div>
        </div>
      </div>

      <!-- High/Low temperatures in bottom right -->
      <div class="weather-card__high-low">
        <span class="text-caption">
          H: <TemperatureDisplay
            size="small"
            :temperature="weather.main.temp_max"
            :unit="unit"
            variant="inline"
          />
        </span>
        <span class="text-caption ml-3">
          L: <TemperatureDisplay
            size="small"
            :temperature="weather.main.temp_min"
            :unit="unit"
            variant="inline"
          />
        </span>
      </div>

      <!-- Favorite button (optional - can be removed if not needed) -->
      <v-btn
        class="weather-card__favorite-btn"
        :color="isFavorite ? 'error' : 'white'"
        :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
        size="small"
        variant="text"
        @click.stop="toggleFavorite"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { TemperatureUnit, WeatherData } from '@/types/weather'
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
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
  const router = useRouter()

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

  const navigateToDetails = () => {
    router.push(`/weather/${encodeURIComponent(props.weather.name)}`)
  }
</script>

<style scoped lang="scss">
  .weather-card {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

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

    &__content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    &__location {
      flex: 1;
      min-width: 0; // Allows text truncation if needed
    }

    &__temperature-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    &__temperature {
      display: flex;
      align-items: center;
    }

    &__icon {
      display: flex;
      justify-content: center;
    }

    &__high-low {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 0.5rem;
    }

    &__favorite-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
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
  }

  @media (max-width: 600px) {
    .weather-card {
      &__content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      &__temperature-section {
        align-items: center;
        width: 100%;
      }

      &__high-low {
        justify-content: center;
      }
    }
  }
</style>
