<template>
  <div class="profile-page">
    <v-container class="py-6" fluid>
      <!-- Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              @click="goBack"
            />
            <h1 class="text-h5 font-weight-bold ml-2">
              Edit Profile
            </h1>
          </div>
        </v-col>
      </v-row>

      <!-- Profile Content -->
      <v-row>
        <v-col
          cols="12"
          lg="6"
          md="8"
          offset-lg="3"
          offset-md="2"
        >
          <v-card class="pa-6" elevation="2" rounded="lg">
            <!-- Profile Picture Section -->
            <div class="text-center mb-6">
              <div class="profile-avatar-container">
                <v-avatar
                  class="profile-avatar"
                  size="120"
                >
                  <v-img
                    :alt="profileStore.profile.name"
                    :src="profileStore.gravatarUrl"
                  />
                </v-avatar>
                <v-btn
                  v-if="isEditing"
                  class="profile-edit-icon"
                  color="primary"
                  icon="mdi-pencil"
                  size="small"
                  variant="elevated"
                />
              </div>
              <h2 class="text-h6 font-weight-bold mt-4">
                {{ profileStore.profile.name }}
              </h2>
              <p class="text-body-2 text-medium-emphasis">
                {{ profileStore.displayInfo }}
              </p>
            </div>

            <!-- Form Section -->
            <v-form
              ref="formRef"
              v-model="formValid"
              @submit.prevent="handleSubmit"
            >
              <!-- Name Field -->
              <div class="mb-4">
                <label class="text-caption text-medium-emphasis mb-2 d-block">
                  Name
                </label>
                <v-text-field
                  v-model="formData.name"
                  density="comfortable"
                  hide-details="auto"
                  placeholder="Enter your name"
                  :readonly="!isEditing"
                  :rules="nameRules"
                  variant="outlined"
                />
              </div>

              <!-- Email Field -->
              <div class="mb-4">
                <label class="text-caption text-medium-emphasis mb-2 d-block">
                  Email
                </label>
                <v-text-field
                  v-model="formData.email"
                  density="comfortable"
                  hide-details="auto"
                  placeholder="Enter your email"
                  :readonly="!isEditing"
                  :rules="emailRules"
                  type="email"
                  variant="outlined"
                />
              </div>

              <!-- Phone Field -->
              <div class="mb-6">
                <PhoneNumberInput
                  v-model="formData.phone"
                  v-model:country-code="formData.countryCode"
                  helper-text="Enter your phone number in international format"
                  label="Phone Number"
                  :readonly="!isEditing"
                  required
                  @validation="handlePhoneValidation"
                />
              </div>

              <!-- Action Button -->
              <v-btn
                block
                class="text-none"
                :color="isEditing ? 'primary' : 'primary'"
                :disabled="isEditing && (!formValid || !phoneValidationState.isValid)"
                :loading="loading"
                size="large"
                type="submit"
                variant="elevated"
              >
                {{ isEditing ? 'SUBMIT' : 'EDIT' }}
              </v-btn>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import PhoneNumberInput from '@/components/atoms/PhoneNumberInput.vue'
  import { useProfileStore } from '@/stores/profile'

  const profileStore = useProfileStore()
  const router = useRouter()

  // Form state
  const isEditing = ref(false)
  const loading = ref(false)
  const formValid = ref(false)
  const formRef = ref()

  // Form data
  const formData = reactive({
    name: profileStore.profile.name,
    email: profileStore.profile.email,
    phone: profileStore.profile.phone,
    countryCode: profileStore.profile.countryCode,
  })

  // Form validation state
  const phoneValidationState = ref({ isValid: true, error: '' })

  // Validation rules
  const nameRules = [
    (v: string) => !!v || 'Name is required',
    (v: string) => v.length >= 2 || 'Name must be at least 2 characters',
    (v: string) => v.length <= 50 || 'Name must be less than 50 characters',
  ]

  const emailRules = [
    (v: string) => !!v || 'Email is required',
    (v: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(v) || 'Please enter a valid email address'
    },
  ]

  // Phone validation handler
  const handlePhoneValidation = (isValid: boolean, error?: string) => {
    phoneValidationState.value = { isValid, error: error || '' }
  }

  // Watch for profile changes to update form data
  watch(
    () => profileStore.profile,
    newProfile => {
      formData.name = newProfile.name
      formData.email = newProfile.email
      formData.phone = newProfile.phone
      formData.countryCode = newProfile.countryCode
    },
    { deep: true },
  )

  // Methods
  const goBack = () => {
    if (isEditing.value) {
      // Reset form data if editing
      formData.name = profileStore.profile.name
      formData.email = profileStore.profile.email
      formData.phone = profileStore.profile.phone
      formData.countryCode = profileStore.profile.countryCode
      isEditing.value = false
    } else {
      router.back()
    }
  }

  const handleSubmit = async () => {
    if (!isEditing.value) {
      // Switch to edit mode
      isEditing.value = true
      return
    }

    // Validate form
    const { valid } = await formRef.value.validate()

    // Also check phone validation state
    if (!valid || !phoneValidationState.value.isValid) {
      console.log('Form validation failed:', {
        formValid: valid,
        phoneValid: phoneValidationState.value.isValid,
        phoneError: phoneValidationState.value.error,
      })
      return
    }

    try {
      loading.value = true

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update profile
      profileStore.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
      })

      // Exit edit mode
      isEditing.value = false

      // Show success message (optional)
      console.log('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.profile-avatar-container {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  border: 4px solid rgb(var(--v-theme-surface-variant));
}

.profile-edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid rgb(var(--v-theme-surface));
}

.v-text-field {
  :deep(.v-field) {
    border-radius: 12px;
  }
}

.v-btn {
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

label {
  font-weight: 500;
}
</style>
