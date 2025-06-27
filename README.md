# Weather App

A modern, responsive weather application built with Vue.js 3, TypeScript, and Vuetify 3. This application demonstrates advanced front-end development practices including atomic design principles, state management, and API integration.

## 🌟 Features

- **Current Weather**: Get real-time weather information for any city
- **5-Day Forecast**: View detailed weather forecasts
- **Location Services**: Use GPS to get weather for your current location
- **Search with Autocomplete**: Smart city search with suggestions
- **Favorites**: Save and manage favorite cities
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with ARIA standards and keyboard navigation
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading indicators throughout the app

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
   
   Edit `.env` and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add the key to your `.env` file

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

### Typography
- Roboto font family
- Consistent sizing scale
- Proper contrast ratios for accessibility

### Responsive Breakpoints
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

## 🧪 Testing

### Manual Testing Checklist

- [ ] Search for cities works correctly
- [ ] Current location detection works
- [ ] Weather data displays properly
- [ ] Forecast shows 5-day data
- [ ] Favorites can be added/removed
- [ ] Temperature units can be switched
- [ ] Error states display appropriately
- [ ] Loading states show during API calls
- [ ] Responsive design works on all devices
- [ ] Accessibility features work (keyboard navigation, screen readers)

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

### Build Configuration

The project uses Vite with the following key configurations:
- TypeScript support
- Vue 3 composition API
- Auto-imports for Vue and Vuetify
- SCSS preprocessing
- Path aliases (@/ for src/)

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on the repository.

---

Built with ❤️ using Vue.js 3 and modern web technologies.
