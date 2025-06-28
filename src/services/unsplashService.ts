interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    id: string
    username: string
    name: string
    profile_image: {
      small: string
      medium: string
      large: string
    }
    links: {
      self: string
      html: string
      photos: string
      likes: string
      portfolio: string
      following: string
      followers: string
    }
  }
  links: {
    self: string
    html: string
    download: string
    download_location: string
  }
  alt_description?: string
}

interface UnsplashResponse {
  results: UnsplashPhoto[]
}

export interface WeatherImageData {
  imageUrl: string
  photographer: {
    name: string
    username: string
    profileUrl: string
  }
  photoUrl: string
}

class UnsplashService {
  private readonly baseUrl = 'https://api.unsplash.com'
  private readonly accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  private readonly appName = 'tawk-to-weather-app'
  private imageCache = new Map<string, WeatherImageData>()

  /**
   * Get a background image URL for a weather condition
   * @param weatherCondition The weather condition (e.g., 'clear sky', 'rain', 'snow')
   * @param width Desired image width (default: 800)
   * @param height Desired image height (default: 600)
   * @returns Promise resolving to WeatherImageData or null if not found
   */
  async getWeatherImage (
    weatherCondition: string,
    width = 800,
    height = 600,
  ): Promise<WeatherImageData | null> {
    if (!this.accessKey) {
      console.warn('Unsplash access key not configured')
      return null
    }

    try {
      // Map weather conditions to better search terms
      const searchQuery = this.mapWeatherToSearchQuery(weatherCondition)

      const url = new URL(`${this.baseUrl}/search/photos`)
      url.searchParams.set('query', searchQuery)
      url.searchParams.set('per_page', '1')
      url.searchParams.set('orientation', 'landscape')
      url.searchParams.set('content_filter', 'high')

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Client-ID ${this.accessKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`)
      }

      const data: UnsplashResponse = await response.json()

      if (data.results && data.results.length > 0) {
        const photo = data.results[0]
        // Return complete weather image data with attribution
        return {
          imageUrl: `${photo.urls.raw}&w=${width}&h=${height}&fit=crop&crop=center`,
          photographer: {
            name: photo.user.name,
            username: photo.user.username,
            profileUrl: `${photo.user.links.html}?utm_source=${this.appName}&utm_medium=referral`,
          },
          photoUrl: `${photo.links.html}?utm_source=${this.appName}&utm_medium=referral`,
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching weather image:', error)
      return null
    }
  }

  /**
   * Get a cached image URL with fallback to fetch if not cached
   * This method implements basic caching to avoid repeated API calls
   */
  async getCachedWeatherImage (
    weatherCondition: string,
    width = 800,
    height = 600,
  ): Promise<WeatherImageData | null> {
    const cacheKey = `${weatherCondition}-${width}x${height}`

    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey) || null
    }

    const imageData = await this.getWeatherImage(weatherCondition, width, height)

    if (imageData) {
      this.imageCache.set(cacheKey, imageData)
    }

    return imageData
  }

  /**
   * Map weather conditions to better search queries for Unsplash
   */
  private mapWeatherToSearchQuery (weatherCondition: string): string {
    const condition = weatherCondition.toLowerCase()

    if (condition.includes('clear') || condition.includes('sunny')) {
      return 'blue sky sunny day landscape'
    }
    if (condition.includes('cloud')) {
      return 'cloudy sky landscape'
    }
    if (condition.includes('rain') || condition.includes('drizzle')) {
      return 'rain weather landscape'
    }
    if (condition.includes('thunder') || condition.includes('storm')) {
      return 'storm thunder lightning landscape'
    }
    if (condition.includes('snow')) {
      return 'snow winter landscape'
    }
    if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
      return 'fog mist landscape'
    }

    // Fallback to generic weather query
    return `${condition} weather landscape`
  }
}

export const unsplashService = new UnsplashService()
