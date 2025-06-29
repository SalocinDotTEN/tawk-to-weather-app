<template>
  <v-card
    class="weather-card"
    :class="weatherConditionClass"
    elevation="2"
    rounded="xl"
    :style="cardStyle"
    @click="navigateToDetails"
  >
    <v-card-text class="pa-4 text-white">
      <div class="weather-card__content">
        <!-- Left side: Location -->
        <div class="weather-card__location">
          <h3 v-if="myLocation" class="text-h5 font-weight-bold">
            My Location
          </h3>
          <h3 :class="(myLocation ? 'text-h6' : 'text-h5') + ' font-weight-bold'">
            {{ weather.name }}, {{ weather.sys.country }}
          </h3>
        </div>

        <!-- Right side: Temperature -->
        <div class="weather-card__temperature-section">
          <!-- Large temperature display -->
          <div class="weather-card__temperature">
            <TemperatureDisplay
              size="xl"
              :temperature="weather.main.temp"
              :unit="unit"
              variant="inline"
            />
          </div>
        </div>
      </div>

      <!-- Weather description in lower left -->
      <div class="weather-card__description">
        <p class="text-caption text-capitalize">
          {{ weather.weather[0].description }}
        </p>
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

      <!-- Favorite button (only show for favorites) -->
      <v-btn
        v-if="isFavorite && showFavoriteButton"
        class="weather-card__favorite-btn"
        color="error"
        icon="mdi-heart-remove"
        size="small"
        variant="text"
        @click.stop="toggleFavorite"
      />

      <!-- Unsplash attribution (only show when image is present) -->
      <div
        v-if="imageAttribution"
        class="weather-card__attribution"
      >
        <span class="text-overline">
          Photo by
          <a
            class="attribution-link"
            :href="imageAttribution.photographer.profileUrl"
            rel="noopener noreferrer"
            target="_blank"
            @click.stop
          >{{ imageAttribution.photographer.name }}</a>
          on
          <a
            class="attribution-link"
            href="https://unsplash.com/?utm_source=tawk-to-weather-app&utm_medium=referral"
            rel="noopener noreferrer"
            target="_blank"
            @click.stop
          >Unsplash</a>
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { LocationData, TemperatureUnit, WeatherData } from '@/types/weather'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import TemperatureDisplay from '@/components/atoms/TemperatureDisplay.vue'
  import { unsplashService, type WeatherImageData } from '@/services/unsplashService'

  interface Props {
    weather: WeatherData
    unit: TemperatureUnit
    isFavorite?: boolean
    showFavoriteButton?: boolean
    myLocation?: boolean
  }

  interface Emits {
    (e: 'toggle-favorite', location: LocationData): void
  }

  const props = withDefaults(defineProps<Props>(), {
    isFavorite: false,
    showFavoriteButton: true,
    myLocation: false,
  })

  const emit = defineEmits<Emits>()
  const router = useRouter()

  // Reactive ref for background image
  const backgroundImage = ref<string | null>(null)
  const imageAttribution = ref<WeatherImageData | null>(null)

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

  // Computed style for the card with background image
  const cardStyle = computed(() => {
    if (backgroundImage.value) {
      return {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }
    return {}
  })

  // Load background image when component mounts
  onMounted(async () => {
    if (props.weather.weather && props.weather.weather.length > 0) {
      const weatherCondition = props.weather.weather[0].description
      // Create a unique location identifier for varied images
      const locationId = `${props.weather.name}-${props.weather.coord.lat}-${props.weather.coord.lon}`
      try {
        const imageData = await unsplashService.getCachedWeatherImage(weatherCondition, 800, 600, locationId)
        if (imageData) {
          backgroundImage.value = imageData.imageUrl
          imageAttribution.value = imageData
        }
      } catch (error) {
        console.warn('Failed to load weather background image:', error)
      }
    }
  })

  const toggleFavorite = () => {
    // Create location data from weather data
    const locationData = {
      name: props.weather.name,
      lat: props.weather.coord.lat,
      lon: props.weather.coord.lon,
      country: props.weather.sys.country,
      // State is not available in weather data, so we'll leave it undefined
      state: undefined,
    }
    emit('toggle-favorite', locationData)
  }

  const navigateToDetails = () => {
    // Include coordinates in the navigation for precise location
    const coords = `?lat=${props.weather.coord.lat}&lon=${props.weather.coord.lon}`
    router.push(`/weather/${encodeURIComponent(props.weather.name)}${coords}`)
  }
</script>

<style scoped lang="scss">
  .weather-card {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    // When background image is present, ensure text is always readable
    &[style*="background-image"] {
      color: white !important;

      .v-card-text {
        position: relative;
        z-index: 2;
      }

      // Ensure all text is white when background image is present
      * {
        color: white !important;
      }

      .text-caption {
        color: rgba(255, 255, 255, 0.9) !important;
      }
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
    }

    &__temperature {
      display: flex;
      align-items: center;
    }

    &__description {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
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

    &__attribution {
      position: absolute;
      bottom: 8px;
      left: 8px;
      z-index: 3;
      font-size: 0.6rem !important;
      line-height: 0.8rem;
      max-width: calc(100% - 16px);

      .text-overline {
        font-size: 0.6rem !important;
        line-height: 0.8rem !important;
        color: rgba(255, 255, 255, 0.8) !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      }

      .attribution-link {
        color: rgba(255, 255, 255, 0.9) !important;
        text-decoration: none;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

        &:hover {
          color: white !important;
          text-decoration: underline;
        }
      }
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

      &__description {
        justify-content: center;
      }

      &__high-low {
        justify-content: center;
      }

      &__attribution {
        position: relative;
        bottom: unset;
        left: unset;
        margin-top: 0.5rem;
        text-align: center;

        .text-overline {
          font-size: 0.55rem !important;
        }
      }
    }
  }
</style>
