<template>
  <v-select
    density="comfortable"
    hide-details="auto"
    item-title="displayName"
    item-value="code"
    :items="enhancedCountries"
    label="Country"
    :model-value="modelValue"
    :readonly="readonly"
    variant="outlined"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #selection="{ item }">
      <div class="d-flex align-center">
        <img
          :alt="`${item.raw.name} flag`"
          class="flag-image mr-2"
          :src="item.raw.flag"
        >
        <span class="mr-2">{{ item.raw.dialCode }}</span>
        <span class="text-caption">{{ item.raw.name }}</span>
      </div>
    </template>

    <template #item="{ item, props }">
      <v-list-item
        v-bind="props"
        :title="item.raw.displayName"
      >
        <template #prepend>
          <img
            :alt="`${item.raw.name} flag`"
            class="flag-image mr-3"
            :src="item.raw.flag"
          >
        </template>

        <template #append>
          <span class="text-caption text-medium-emphasis">{{ item.raw.dialCode }}</span>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>

<script setup lang="ts">
  import type { CountryCode } from 'libphonenumber-js'
  import { computed } from 'vue'
  import { countries, type Country } from '@/utils/phoneNumber'

  interface Props {
    modelValue?: CountryCode
    readonly?: boolean
  }

  interface Emits {
    (e: 'update:modelValue', value: CountryCode): void
  }

  defineProps<Props>()
  defineEmits<Emits>()

  // Enhanced countries with display names for better UX
  const enhancedCountries = computed(() =>
    countries.map((country: Country) => ({
      ...country,
      displayName: `${country.name} (${country.dialCode})`,
    })),
  )
</script>

<style scoped lang="scss">
.v-select {
  :deep(.v-field) {
    border-radius: 12px;
  }
}

.flag-image {
  width: 20px;
  height: auto;
  object-fit: contain;
  border-radius: 2px;
}
</style>
