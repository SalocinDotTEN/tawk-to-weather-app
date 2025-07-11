export interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: WeatherCondition[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  rain?: {
    '1h'?: number
    '3h'?: number
  }
  snow?: {
    '1h'?: number
    '3h'?: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface ForecastData {
  cod: string
  message: number
  cnt: number
  list: ForecastItem[]
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export interface ForecastItem {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: WeatherCondition[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  visibility: number
  pop: number
  rain?: {
    '3h': number
  }
  snow?: {
    '3h': number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}

export interface LocationData {
  name: string
  local_names?: Record<string, string>
  lat: number
  lon: number
  country: string
  state?: string
}

export interface SearchFormData {
  city: string
  country?: string
}

export enum TemperatureUnit {
  CELSIUS = 'metric',
  FAHRENHEIT = 'imperial',
  KELVIN = 'standard',
}

export interface FavoriteLocation {
  name: string
  state?: string
  country: string
  lat: number
  lon: number
  // Create unique identifier for the location
  id: string
}

export interface WeatherState {
  currentWeather: WeatherData | null
  forecast: ForecastData | null
  favorites: FavoriteLocation[]
  unit: TemperatureUnit
  loading: boolean
  error: string | null
}
