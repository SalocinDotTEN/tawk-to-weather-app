import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface ProfileData {
  name: string
  email: string
  phone: string
  countryCode: string
}

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref<ProfileData>({
    name: 'Jane Doe',
    email: 'jane@gmail.com',
    phone: '123-456-7890',
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
    const phone = profile.value.phone
    const countryCode = profile.value.countryCode === 'US' ? '+1' : '+1'
    return `${countryCode} ${phone}`
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
