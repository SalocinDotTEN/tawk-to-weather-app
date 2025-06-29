<template>
  <div class="phone-input-container">
    <label class="text-caption text-medium-emphasis mb-2 d-block">
      {{ label }}
    </label>

    <div class="phone-input-wrapper">
      <!-- Country Selector -->
      <div class="country-selector">
        <CountrySelector
          :model-value="selectedCountry"
          :readonly="readonly"
          @update:model-value="handleCountryChange"
        />
      </div>

      <!-- Phone Number Input -->
      <div class="phone-number-input">
        <v-text-field
          ref="textFieldRef"
          density="comfortable"
          hide-details="auto"
          :model-value="displayValue"
          :placeholder="placeholder"
          :readonly="readonly"
          :rules="validationRules"
          variant="outlined"
          @blur="validatePhone"
          @update:model-value="handlePhoneChange"
        >
          <template #prepend-inner>
            <div class="d-flex align-center">
              <span class="text-body-2 mr-2">{{ selectedCountryData?.dialCode }}</span>
            </div>
          </template>
        </v-text-field>
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="text-caption text-error mt-1"
    >
      {{ errorMessage }}
    </div>

    <!-- Helper Text -->
    <div
      v-if="helperText && !errorMessage"
      class="text-caption text-medium-emphasis mt-1"
    >
      {{ helperText }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CountryCode } from 'libphonenumber-js'
  import { computed, onMounted, ref, watch } from 'vue'
  import {
    formatPhoneNumberForDisplay,
    getCountryByCode,
    validateAndFormatPhoneNumber,
  } from '@/utils/phoneNumber'
  import CountrySelector from './CountrySelector.vue'

  interface Props {
    modelValue?: string // E.164 format
    countryCode?: CountryCode
    label?: string
    placeholder?: string
    readonly?: boolean
    required?: boolean
    helperText?: string
  }

  interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'update:countryCode', value: CountryCode): void
    (e: 'validation', isValid: boolean, error?: string): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    countryCode: 'US' as CountryCode,
    label: 'Phone Number',
    placeholder: '',
    readonly: false,
    required: false,
    helperText: '',
  })

  const emit = defineEmits<Emits>()

  // Internal state
  const selectedCountry = ref<CountryCode>(props.countryCode)
  const internalPhone = ref('')
  const errorMessage = ref('')
  const textFieldRef = ref()

  // Computed properties
  const selectedCountryData = computed(() => getCountryByCode(selectedCountry.value))

  const displayValue = computed(() => {
    if (props.modelValue && props.modelValue.startsWith('+')) {
      // If we have an E.164 number, format it for display without country code
      return formatPhoneNumberForDisplay(props.modelValue, selectedCountry.value)
        .replace(selectedCountryData.value?.dialCode || '', '')
        .trim()
    }
    return internalPhone.value
  })

  const validationRules = computed(() => {
    const rules: Array<(v: string) => boolean | string> = []

    if (props.required) {
      rules.push((v: string) => {
        if (!v || v.trim() === '') {
          errorMessage.value = 'Phone number is required'
          emit('validation', false, 'Phone number is required')
          return 'Phone number is required'
        }
        return true
      })
    }

    rules.push((v: string) => {
      if (!v && !props.required) {
        errorMessage.value = ''
        emit('validation', true)
        return true
      }

      if (!v) {
        return true // Already handled by required rule above
      }

      const validation = validateAndFormatPhoneNumber(v, selectedCountry.value)
      if (!validation.isValid) {
        errorMessage.value = validation.error || 'Invalid phone number'
        emit('validation', false, validation.error)
        return validation.error || 'Invalid phone number'
      }

      errorMessage.value = ''
      emit('validation', true)
      return true
    })

    return rules
  })

  // Methods
  const handleCountryChange = (newCountry: CountryCode) => {
    selectedCountry.value = newCountry
    emit('update:countryCode', newCountry)

    // Revalidate phone number with new country
    if (internalPhone.value) {
      handlePhoneChange(internalPhone.value)
    } else {
      // Trigger validation even for empty value to update validation state
      const validation = validateAndFormatPhoneNumber('', newCountry)
      emit('validation', !props.required || validation.isValid, validation.error)
    }
  }

  const handlePhoneChange = (value: string) => {
    internalPhone.value = value

    if (!value) {
      emit('update:modelValue', '')
      return
    }

    const validation = validateAndFormatPhoneNumber(value, selectedCountry.value)

    if (validation.isValid) {
      emit('update:modelValue', validation.formatted)
      errorMessage.value = ''
      emit('validation', true)
    } else {
      emit('update:modelValue', value) // Keep the raw value for now
      errorMessage.value = validation.error || 'Invalid phone number'
      emit('validation', false, validation.error)
    }
  }

  const validatePhone = () => {
    if (textFieldRef.value) {
      textFieldRef.value.validate()
    }
  }

  // Watchers
  watch(
    () => props.countryCode,
    newCountryCode => {
      selectedCountry.value = newCountryCode
    },
    { immediate: true },
  )

  watch(
    () => props.modelValue,
    newValue => {
      if (newValue && newValue.startsWith('+')) {
        // This is an E.164 number, extract the local part
        const localNumber = formatPhoneNumberForDisplay(newValue, selectedCountry.value)
          .replace(selectedCountryData.value?.dialCode || '', '')
          .trim()
        internalPhone.value = localNumber
      } else {
        internalPhone.value = newValue || ''
      }
    },
    { immediate: true },
  )

  // Initialize validation state on mount
  onMounted(() => {
    // Set initial validation state
    if (props.required && !internalPhone.value) {
      emit('validation', false, 'Phone number is required')
    } else if (internalPhone.value) {
      // Validate existing phone number
      const validation = validateAndFormatPhoneNumber(internalPhone.value, selectedCountry.value)
      emit('validation', validation.isValid, validation.error)
    } else {
      emit('validation', true)
    }
  })
</script>

<style scoped lang="scss">
.phone-input-container {
  width: 100%;
}

.phone-input-wrapper {
  display: flex;
  gap: 8px;

  .country-selector {
    min-width: 200px;
    flex-shrink: 0;
  }

  .phone-number-input {
    flex: 1;
  }
}

.v-text-field {
  :deep(.v-field) {
    border-radius: 12px;
  }
}

@media (max-width: 600px) {
  .phone-input-wrapper {
    flex-direction: column;
    gap: 12px;

    .country-selector {
      min-width: auto;
    }
  }
}
</style>
