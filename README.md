# 🌤️ Weather App Pro

A modern, feature-rich weather application built with Node.js, Express.js, and cutting-edge web technologies. Get accurate weather forecasts for any location worldwide with a beautiful, responsive interface.

![Weather App Pro](https://img.shields.io/badge/Version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-14+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🌍 **Global Weather Coverage**
- Real-time weather data for any location worldwide
- Advanced geocoding with MapBox API
- Support for cities, postal codes, landmarks, and addresses

### 📊 **Comprehensive Weather Information**
- Current weather conditions with detailed metrics
- 7-day detailed forecast with hourly predictions
- Temperature, humidity, pressure, wind speed, and visibility
- Sunrise/sunset times and UV index

### 🎨 **Modern User Experience**
- Beautiful, responsive design that works on all devices
- Smooth animations and transitions
- Dark mode support
- Progressive Web App (PWA) capabilities
- Accessibility compliant

### ⚡ **Performance & Reliability**
- Intelligent caching system (5-minute TTL)
- Multiple API providers for redundancy
- Error handling and fallback mechanisms
- Optimized loading states and user feedback

### 🔧 **Developer-Friendly**
- RESTful API endpoints
- Comprehensive error handling
- Security middleware (Helmet, CORS)
- Environment configuration
- Modern ES6+ JavaScript

## 🚀 Quick Start

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn package manager
- API keys for weather services (see Configuration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app-pro.git
   cd weather-app-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create a .env file in the root directory
   cp config.js .env.local
   ```
   
   Edit the configuration file with your API keys:
   ```javascript
   // config.js
   module.exports = {
       OPENWEATHER_API_KEY: 'your_openweather_api_key_here',
       MAPBOX_API_KEY: 'your_mapbox_api_key_here',
       PORT: 3000,
       NODE_ENV: 'development'
   };
   ```

4. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup

### OpenWeatherMap API
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add it to your configuration

### MapBox API
1. Visit [MapBox](https://www.mapbox.com/)
2. Create a free account
3. Generate an access token
4. Add it to your configuration

## 📁 Project Structure

```
weather-app-pro/
├── src/
│   ├── app.js                 # Main application file
│   └── utils/
│       ├── geocode.js         # Geocoding service
│       └── weatherService.js  # Weather API service
├── public/
│   ├── css/
│   │   └── styles.css         # Modern CSS styles
│   ├── js/
│   │   └── app.js             # Client-side JavaScript
│   └── images/                # Static assets
├── templates/
│   ├── views/                 # Handlebars templates
│   │   ├── index.hbs
│   │   ├── about.hbs
│   │   ├── help.hbs
│   │   └── error.hbs
│   └── partials/              # Reusable components
│       ├── header.hbs
│       └── footer.hbs
├── config.js                  # Configuration file
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Handlebars** - Template engine
- **Axios** - HTTP client for API requests
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Compression** - Response compression

### Frontend
- **Modern CSS3** - CSS Grid, Flexbox, Custom Properties
- **Vanilla JavaScript** - ES6+ features, async/await
- **Responsive Design** - Mobile-first approach
- **Progressive Web App** - Service worker ready

### APIs & Services
- **OpenWeatherMap API** - Weather data provider
- **MapBox API** - Geocoding and location services

## 📱 Usage

### Basic Usage
1. Enter a location in the search box (city, postal code, or address)
2. Click "Get Weather" or press Enter
3. View current weather and 7-day forecast

### Search Tips
- Use city names: "London", "New York", "Tokyo"
- Include country for accuracy: "London, UK"
- Try postal codes: "10001", "SW1A 1AA"
- Use landmarks: "Times Square", "Eiffel Tower"

### API Endpoints

#### Get Weather by Location
```http
GET /weather?address=London&units=metric
```

**Response:**
```json
{
  "success": true,
  "location": {
    "name": "London, England, United Kingdom",
    "context": "England, United Kingdom",
    "type": "place",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    }
  },
  "weather": {
    "current": {
      "temperature": 15,
      "feelsLike": 13,
      "humidity": 78,
      "pressure": 1013,
      "description": "overcast clouds",
      "windSpeed": 3.2,
      "sunrise": "07:30:00",
      "sunset": "17:45:00"
    },
    "forecast": [...]
  }
}
```

#### Health Check
```http
GET /api/health
```

#### Current Weather by Coordinates
```http
GET /api/current/:lat/:lon?units=metric
```

## 🎨 Customization

### Styling
The app uses CSS custom properties for easy theming. Modify the `:root` variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --text-primary: #1f2937;
    --bg-primary: #ffffff;
    /* ... more variables */
}
```

### Adding New Features
1. Create new routes in `src/app.js`
2. Add corresponding templates in `templates/views/`
3. Update navigation in `templates/partials/header.hbs`
4. Add client-side logic in `public/js/app.js`

## 🚀 Deployment

### Heroku
1. Create a Heroku app
2. Set environment variables:
   ```bash
   heroku config:set OPENWEATHER_API_KEY=your_key
   heroku config:set MAPBOX_API_KEY=your_key
   heroku config:set NODE_ENV=production
   ```
3. Deploy:
   ```bash
   git push heroku main
   ```

### Vercel
1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically on push

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aniket Mahangade**
- Full Stack Software Developer
- Passionate about creating innovative web applications

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [MapBox](https://www.mapbox.com/) for geocoding services
- [Inter Font](https://rsms.me/inter/) for beautiful typography
- The open-source community for inspiration and tools

## 📞 Support

- 📧 Email: support@weatherapp.com
- 💻 GitHub Issues: [Report a bug](https://github.com/yourusername/weather-app-pro/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/weather-app-pro/wiki)

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by [Aniket Mahangade](https://github.com/yourusername)
