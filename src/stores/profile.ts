import type { CountryCode } from 'libphonenumber-js'
import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'
import { formatE164ForDisplay } from '@/utils/phoneNumber'

export interface ProfileData {
  name: string
  email: string
  phone: string // E.164 format
  countryCode: CountryCode
}

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref<ProfileData>({
    name: '',
    email: '',
    phone: '',
    countryCode: 'US',
  })

  // Getters
  const gravatarUrl = computed(() => {
    if (!profile.value.email) {
      return ''
    }

    // Create MD5 hash of email for Gravatar
    const email = profile.value.email.toLowerCase().trim()
    const hash = createMD5Hash(email)
    return `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
  })

  const formattedPhone = computed(() => {
    if (!profile.value.phone) {
      return ''
    }

    // If phone is already in E.164 format, format it for display
    if (profile.value.phone.startsWith('+')) {
      return formatE164ForDisplay(profile.value.phone)
    }

    // Fallback for old format
    return profile.value.phone
  })

  const displayInfo = computed(() => {
    return `${profile.value.email} | ${formattedPhone.value}`
  })

  // Actions
  const updateProfile = (newProfile: Partial<ProfileData>) => {
    profile.value = { ...profile.value, ...newProfile }
    saveToLocalStorage()
  }

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('user-profile')
    if (saved) {
      try {
        const parsedProfile = JSON.parse(saved)
        profile.value = { ...profile.value, ...parsedProfile }
      } catch (error) {
        console.error('Failed to load profile from localStorage:', error)
      }
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('user-profile', JSON.stringify(profile.value))
  }

  // MD5 hash function for Gravatar
  const createMD5Hash = (str: string): string => {
    return CryptoJS.MD5(str).toString()
  }

  // Initialize
  loadFromLocalStorage()

  return {
    profile: readonly(profile),
    gravatarUrl,
    formattedPhone,
    displayInfo,
    updateProfile,
    loadFromLocalStorage,
    saveToLocalStorage,
  }
})
