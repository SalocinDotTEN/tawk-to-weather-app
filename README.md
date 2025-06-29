# Weather App

A modern, responsive weather application built with Vue.js 3, TypeScript, and Vuetify 3. This application demonstrates advanced front-end development practices including atomic design principles, state management, and API integration.

## 🌟 Features

- **Current Weather**: Get real-time weather information for any city
- **5-Day Forecast**: View detailed weather forecasts
- **Dynamic Background Images**: Weather cards display beautiful background images matching weather conditions (powered by Unsplash)
- **Location Services**: Use GPS to get weather for your current location
- **Search with Autocomplete**: Smart city search with suggestions
- **Favorites**: Save and manage favorite cities
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with ARIA standards and keyboard navigation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading indicators throughout the app

## Gravatar Integration for User Profile
- Automatically generates profile pictures from email using Gravatar service
- Falls back to identicon if no Gravatar exists for the email
- Updates automatically when email is changed

## Form Validation Rules for User Profile
- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format
- **Phone**: Required, must match E.164 format

## 🏗️ Architecture

This project follows **Atomic Design** principles for component organization:

### Component Structure
```
src/components/
├── atoms/           # Basic building blocks
│   ├── WeatherIcon.vue
│   ├── TemperatureDisplay.vue
│   └── LoadingSpinner.vue
├── molecules/       # Groups of atoms
│   ├── SearchBar.vue
│   └── WeatherCard.vue
├── organisms/       # Complex UI sections
│   └── ForecastList.vue
└── templates/       # Page-level layouts
    └── WeatherPageTemplate.vue
```

### Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vuetify 3** - Material Design component framework
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server
- **SCSS** - CSS preprocessor

**Lines of Code**: ~2,000+ lines
**Components Created**: 10+ reusable components
**Features Implemented**: 15+ core and advanced features

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tawk-to-weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys (the Vite prefix `VITE_` is required for environment variables in Vite projects):
   ```
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:<whatever port>` (default is usually 3000) to view the app.

### Getting API Keys

#### OpenWeatherMap API
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env` file as `VITE_OPENWEATHER_API_KEY`

#### Unsplash API (for weather background images)
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Sign up for a free account
3. Create a new application
4. Copy the "Access Key" 
5. Add the key to your `.env` file as `VITE_UNSPLASH_ACCESS_KEY`

**Note**: The Unsplash API is optional. If not configured, weather cards will use the default gradient backgrounds and may not display custom images.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # Vue components (Atomic Design)
├── pages/              # Page components
├── stores/             # Pinia stores
├── services/           # API services
├── types/              # TypeScript type definitions
├── styles/             # Global styles
├── assets/             # Static assets
└── plugins/            # Vue plugins
```

### State Management

The application uses **Pinia** for state management with the following stores:

- **Weather Store** (`src/stores/weather.ts`)
  - Current weather data
  - Forecast data
  - Favorites management
  - Temperature unit preferences
  - Loading and error states

Controlling API calls and state updates through a single store allows for better maintainability and scalability of the application.

### API Integration

Weather data is fetched from the **OpenWeatherMap API**:

- Current Weather API
- 5-Day Forecast API
- Geocoding API for location search

The `weatherService` (`src/services/weatherService.ts`) handles all API interactions with proper error handling and TypeScript types.

## 🎨 Design System

### Color Scheme
- Primary: Blue gradient theme
- Secondary: Complementary accent colors
- Surface: Clean white/light backgrounds
- Error: Red for error states
- Adaptive theme support for light and dark modes depending on device settings or stored in localStorage.

### Typography
- Roboto font family
- Consistent sizing scale
- Proper contrast ratios for accessibility

### Responsive Breakpoints
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

### Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🌐 Web APIs Used

This application integrates the following Web APIs:

1. **Geolocation API** - For getting user's current location
2. **Local Storage API** - For persisting favorite cities
3. **Fetch API** (via Axios) - For HTTP requests

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatibility
- Focus management

## 🚀 Performance Optimizations

- Lazy loading of components
- Debounced search input
- Efficient state management
- Optimized bundle size
- Image optimization
- Minimal re-renders

## 📱 Progressive Web App Features

The application includes PWA-ready features:
- Responsive design
- Offline-capable architecture
- Fast loading times
- Mobile-optimized interface

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |
| `VITE_UNSPLASH_ACCESS_KEY` | Unsplash API key for background images | No |

### Build Configuration

The project uses Vite with the following key configurations:
- TypeScript support
- Vue 3 composition API
- Auto-imports for Vue and Vuetify
- SCSS preprocessing
- Path aliases (@/ for src/)

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open an issue on the repository.

---

Built using Vue.js 3 and modern web technologies by Salocin.TEN (https://www.salocinten.online).
