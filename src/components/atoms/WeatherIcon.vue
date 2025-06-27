<template>
  <div class="weather-icon">
    <img
      :alt="description"
      :class="iconClass"
      :src="iconUrl"
      @error="onImageError"
    >
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import weatherService from '@/services/weatherService'

  interface Props {
    iconCode: string
    description: string
    size?: '2x' | '4x'
    class?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: '2x',
    class: '',
  })

  const imageError = ref(false)

  const iconUrl = computed(() => {
    if (imageError.value) {
      return '/weather-placeholder.png' // Fallback icon
    }
    return weatherService.getWeatherIconUrl(props.iconCode, props.size)
  })

  const iconClass = computed(() => {
    const baseClass = 'weather-icon__image'
    const sizeClass = `weather-icon__image--${props.size}`
    return [baseClass, sizeClass, props.class].filter(Boolean).join(' ')
  })

  const onImageError = () => {
    imageError.value = true
  }
</script>

<style scoped lang="scss">
.weather-icon {
  display: inline-block;

  &__image {
    display: block;
    max-width: 100%;
    height: auto;

    &--2x {
      width: 50px;
      height: 50px;
    }

    &--4x {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
