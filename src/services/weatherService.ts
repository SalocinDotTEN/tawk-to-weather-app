import type { ForecastData, LocationData, WeatherData } from '@/types/weather'
import axios from 'axios'
import { TemperatureUnit } from '@/types/weather'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

class WeatherService {
  private apiKey: string

  constructor (apiKey: string = API_KEY) {
    this.apiKey = apiKey
  }

  /**
   * Get current weather by city name
   */
  async getCurrentWeather (city: string, units: TemperatureUnit = TemperatureUnit.CELSIUS): Promise<WeatherData> {
    try {
      const response = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to fetch weather data')
    }
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoords (lat: number, lon: number, units: TemperatureUnit = TemperatureUnit.CELSIUS): Promise<WeatherData> {
    try {
      const response = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Weather API Error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to fetch weather data')
    }
  }

  /**
   * Get 5-day weather forecast
   */
  async getForecast (city: string, units: TemperatureUnit = TemperatureUnit.CELSIUS): Promise<ForecastData> {
    try {
      const response = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Forecast API Error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to fetch forecast data')
    }
  }

  /**
   * Get 5-day weather forecast by coordinates
   */
  async getForecastByCoords (lat: number, lon: number, units: TemperatureUnit = TemperatureUnit.CELSIUS): Promise<ForecastData> {
    try {
      const response = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Forecast API Error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to fetch forecast data')
    }
  }

  /**
   * Search for locations by city name
   */
  async searchLocations (query: string, limit = 5): Promise<LocationData[]> {
    try {
      const response = await axios.get<LocationData[]>(`${GEO_URL}/direct`, {
        params: {
          q: query,
          limit,
          appid: this.apiKey,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Geocoding API Error: ${error.response?.data?.message || error.message}`)
      }
      throw new Error('Failed to search locations')
    }
  }

  /**
   * Get weather icon URL
   */
  getWeatherIconUrl (iconCode: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`
  }

  /**
   * Format temperature based on unit
   */
  formatTemperature (temp: number, unit: TemperatureUnit): string {
    const rounded = Math.round(temp)
    switch (unit) {
      case TemperatureUnit.CELSIUS: {
        return `${rounded}°C`
      }
      case TemperatureUnit.FAHRENHEIT: {
        return `${rounded}°F`
      }
      case TemperatureUnit.KELVIN: {
        return `${rounded}K`
      }
      default: {
        return `${rounded}°C`
      }
    }
  }

  /**
   * Get user's current location using Geolocation API
   */
  async getCurrentLocation (): Promise<{ lat: number, lon: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        error => {
          reject(new Error(`Geolocation error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 300_000, // 5 minutes
        },
      )
    })
  }
}

export const weatherService = new WeatherService()
export default weatherService
