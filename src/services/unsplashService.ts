interface UnsplashPhoto {
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description?: string
}

interface UnsplashResponse {
  results: UnsplashPhoto[]
}

class UnsplashService {
  private readonly baseUrl = 'https://api.unsplash.com'
  private readonly accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY
  private imageCache = new Map<string, string>()

  /**
   * Get a background image URL for a weather condition
   * @param weatherCondition The weather condition (e.g., 'clear sky', 'rain', 'snow')
   * @param width Desired image width (default: 800)
   * @param height Desired image height (default: 600)
   * @returns Promise resolving to image URL or null if not found
   */
  async getWeatherImage (
    weatherCondition: string,
    width = 800,
    height = 600,
  ): Promise<string | null> {
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
        // Return optimized URL with custom dimensions
        return `${photo.urls.raw}&w=${width}&h=${height}&fit=crop&crop=center`
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
  ): Promise<string | null> {
    const cacheKey = `${weatherCondition}-${width}x${height}`

    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey) || null
    }

    const imageUrl = await this.getWeatherImage(weatherCondition, width, height)

    if (imageUrl) {
      this.imageCache.set(cacheKey, imageUrl)
    }

    return imageUrl
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
