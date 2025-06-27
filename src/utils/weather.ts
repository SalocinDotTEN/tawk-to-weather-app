/**
 * Weather utility functions
 */

import type { WeatherCondition } from '@/types/weather'

/**
 * Get weather condition color based on weather type
 */
export function getWeatherColor (condition: WeatherCondition): string {
  const main = condition.main.toLowerCase()

  switch (main) {
    case 'clear': {
      return '#FFA726'
    } // Orange
    case 'clouds': {
      return '#78909C'
    } // Blue Grey
    case 'rain':
    case 'drizzle': {
      return '#42A5F5'
    } // Blue
    case 'thunderstorm': {
      return '#5C6BC0'
    } // Indigo
    case 'snow': {
      return '#E1F5FE'
    } // Light Blue
    case 'mist':
    case 'fog':
    case 'haze': {
      return '#90A4AE'
    } // Blue Grey
    default: {
      return '#78909C'
    } // Default Blue Grey
  }
}

/**
 * Get weather condition icon name for Material Design Icons
 */
export function getWeatherMdiIcon (condition: WeatherCondition): string {
  const main = condition.main.toLowerCase()
  const description = condition.description.toLowerCase()

  if (main === 'clear') {
    return 'mdi-weather-sunny'
  }

  if (main === 'clouds') {
    if (description.includes('few')) {
      return 'mdi-weather-partly-cloudy'
    }
    return 'mdi-weather-cloudy'
  }

  if (main === 'rain') {
    if (description.includes('light')) {
      return 'mdi-weather-rainy'
    }
    if (description.includes('heavy')) {
      return 'mdi-weather-pouring'
    }
    return 'mdi-weather-rainy'
  }

  if (main === 'drizzle') {
    return 'mdi-weather-partly-rainy'
  }

  if (main === 'thunderstorm') {
    return 'mdi-weather-lightning'
  }

  if (main === 'snow') {
    return 'mdi-weather-snowy'
  }

  if (main === 'mist' || main === 'fog' || main === 'haze') {
    return 'mdi-weather-fog'
  }

  return 'mdi-weather-cloudy'
}

/**
 * Format wind direction from degrees to compass direction
 */
export function getWindDirection (degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW',
  ]

  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Get air quality description based on visibility
 */
export function getAirQualityDescription (visibility: number): string {
  if (visibility >= 10_000) {
    return 'Excellent'
  } else if (visibility >= 7000) {
    return 'Good'
  } else if (visibility >= 5000) {
    return 'Fair'
  } else if (visibility >= 3000) {
    return 'Poor'
  } else {
    return 'Very Poor'
  }
}

/**
 * Format timestamp to relative time
 */
export function getRelativeTime (timestamp: number): string {
  const now = Date.now()
  const time = timestamp * 1000
  const diff = now - time

  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

/**
 * Check if it's currently day or night based on sunrise/sunset
 */
export function isDayTime (currentTime: number, sunrise: number, sunset: number): boolean {
  return currentTime >= sunrise && currentTime <= sunset
}
