<template>
  <v-form
    ref="formRef"
    class="search-bar"
    @submit.prevent="handleSubmit"
  >
    <v-row
      align="center"
      no-gutters
    >
      <v-col>
        <v-text-field
          v-model="searchQuery"
          clearable
          density="comfortable"
          :error-messages="errorMessage"
          hide-details="auto"
          label="Search for a city..."
          :loading="loading"
          placeholder="Enter city name"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @input="clearError"
          @keyup.enter="handleSubmit"
        />
      </v-col>
      <v-col
        class="ml-2"
        cols="auto"
      >
        <v-btn
          color="primary"
          :disabled="!searchQuery.trim()"
          icon="mdi-magnify"
          :loading="loading"
          size="large"
          @click="handleSubmit"
        />
      </v-col>
      <v-col
        class="ml-2"
        cols="auto"
      >
        <v-btn
          color="secondary"
          icon="mdi-crosshairs-gps"
          :loading="locationLoading"
          size="large"
          @click="handleLocationSearch"
        />
      </v-col>
    </v-row>

    <!-- Search suggestions -->
    <v-list
      v-if="suggestions.length > 0"
      class="search-bar__suggestions"
      density="compact"
    >
      <v-list-item
        v-for="suggestion in suggestions"
        :key="`${suggestion.lat}-${suggestion.lon}`"
        :subtitle="getLocationSubtitle(suggestion)"
        :title="suggestion.name"
        @click="selectSuggestion(suggestion)"
      >
        <template #prepend>
          <v-icon icon="mdi-map-marker" />
        </template>
      </v-list-item>
    </v-list>
  </v-form>
</template>

<script setup lang="ts">
  import type { LocationData } from '@/types/weather'
  import { computed, ref, watch } from 'vue'

  interface Props {
    loading?: boolean
    locationLoading?: boolean
    suggestions?: LocationData[]
  }

  interface Emits {
    (e: 'search', query: string): void
    (e: 'location-search'): void
    (e: 'select-location', location: LocationData): void
    (e: 'input', query: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    locationLoading: false,
    suggestions: () => [],
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()
  const searchQuery = ref('')
  const errorMessage = ref('')

  const handleSubmit = async () => {
    if (!searchQuery.value.trim()) return

    try {
      await formRef.value?.validate()
      emit('search', searchQuery.value.trim())
    } catch (error) {
      console.error('Form validation failed:', error)
    }
  }

  const handleLocationSearch = () => {
    emit('location-search')
  }

  const selectSuggestion = (location: LocationData) => {
    searchQuery.value = location.name
    emit('select-location', location)
  }

  const clearError = () => {
    errorMessage.value = ''
  }

  const getLocationSubtitle = (location: LocationData): string => {
    const parts = []
    if (location.state) parts.push(location.state)
    if (location.country) parts.push(location.country)
    return parts.join(', ')
  }

  // Watch for input changes and emit to parent
  watch(searchQuery, newValue => {
    emit('input', newValue)
  })

  // Validation rules
  const rules = {
    required: (value: string) => !!value || 'City name is required',
    minLength: (value: string) => value.length >= 2 || 'City name must be at least 2 characters',
  }
</script>

<style scoped lang="scss">
  .search-bar {
    position: relative;

    &__suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid rgb(var(--v-theme-outline));
      border-radius: 4px;
      background: rgb(var(--v-theme-surface));
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
  }
</style>
