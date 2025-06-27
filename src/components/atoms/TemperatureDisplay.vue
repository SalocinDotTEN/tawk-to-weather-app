<template>
  <span :class="temperatureClass">
    {{ formattedTemperature }}
  </span>
</template>

<script setup lang="ts">
  import type { TemperatureUnit } from '@/types/weather'
  import { computed } from 'vue'
  import weatherService from '@/services/weatherService'

  interface Props {
    temperature: number
    unit: TemperatureUnit
    size?: 'small' | 'medium' | 'large' | 'xl'
    variant?: 'primary' | 'secondary' | 'muted' | 'strong' | 'inline'
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'medium',
    variant: 'primary',
  })

  const formattedTemperature = computed(() => {
    return weatherService.formatTemperature(props.temperature, props.unit)
  })

  const temperatureClass = computed(() => {
    return [
      'temperature-display',
      `temperature-display--${props.size}`,
      `temperature-display--${props.variant}`,
    ]
  })
</script>

<style scoped lang="scss">
  .temperature-display {
    font-weight: 600;
    line-height: 1.2;

    &--small {
      font-size: 0.875rem;
    }

    &--medium {
      font-size: 1.25rem;
    }

    &--large {
      font-size: 2.5rem;
    }

    &--xl {
      font-size: 3.5rem;
      font-weight: 700;
    }

    &--primary {
      color: rgb(var(--v-theme-primary));
    }

    &--secondary {
      color: rgb(var(--v-theme-secondary));
    }

    &--muted {
      color: rgb(var(--v-theme-on-surface-variant));
    }

    &--strong {
      font-weight: 700;
    }

    &--inline {
      display: inline;
      font-weight: inherit;
    }
  }
</style>
