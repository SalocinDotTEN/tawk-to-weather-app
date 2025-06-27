<template>
  <div :class="spinnerClass">
    <v-progress-circular
      :color="color"
      indeterminate
      :size="size"
      :width="width"
    />
    <div
      v-if="text"
      class="loading-spinner__text"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  interface Props {
    size?: number | string
    color?: string
    width?: number
    text?: string
    centered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 40,
    color: 'primary',
    width: 4,
    text: '',
    centered: false,
  })

  const spinnerClass = computed(() => {
    return [
      'loading-spinner',
      {
        'loading-spinner--centered': props.centered,
      },
    ]
  })
</script>

<style scoped lang="scss">
  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    &--centered {
      justify-content: center;
      min-height: 200px;
    }

    &__text {
      font-size: 0.875rem;
      color: rgb(var(--v-theme-on-surface-variant));
      text-align: center;
    }
  }
</style>
