// Demo Weather Service - Works without API keys
const config = require('../../config');

class DemoWeatherService {
    constructor() {
        this.cache = new Map();
        this.cacheTTL = config.CACHE_TTL * 1000;
    }

    // Get demo current weather
    async getCurrentWeather(latitude, longitude, units = 'metric') {
        const cacheKey = `demo_current_${latitude}_${longitude}_${units}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
        }

        // Generate demo weather data
        const demoData = this.generateDemoWeather(latitude, longitude, units);
        
        // Cache the result
        this.cache.set(cacheKey, {
            data: demoData,
            timestamp: Date.now()
        });

        return demoData;
    }

    // Get demo forecast
    async getForecast(latitude, longitude, units = 'metric') {
        const cacheKey = `demo_forecast_${latitude}_${longitude}_${units}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
        }

        const forecastData = this.generateDemoForecast(units);
        
        // Cache the result
        this.cache.set(cacheKey, {
            data: forecastData,
            timestamp: Date.now()
        });

        return forecastData;
    }

    // Generate demo weather data
    generateDemoWeather(latitude, longitude, units) {
        const baseTemp = units === 'metric' ? 22 : 72;
        const tempVariation = Math.sin(Date.now() / 1000000) * 10;
        
        return {
            temperature: Math.round(baseTemp + tempVariation),
            feelsLike: Math.round(baseTemp + tempVariation - 2),
            humidity: Math.round(60 + Math.random() * 30),
            pressure: Math.round(1013 + Math.random() * 20),
            visibility: Math.round(8 + Math.random() * 4),
            windSpeed: Math.round(Math.random() * 10),
            windDirection: Math.round(Math.random() * 360),
            description: this.getRandomDescription(),
            icon: this.getRandomIcon(),
            main: 'Clouds',
            sunrise: '06:30:00',
            sunset: '18:45:00',
            country: 'Demo',
            city: 'Demo Location',
            timestamp: new Date().toISOString()
        };
    }

    // Generate demo forecast
    generateDemoForecast(units) {
        const baseTemp = units === 'metric' ? 22 : 72;
        const days = [];
        
        for (let i = 0; i < 7; i++) {
            const tempVariation = Math.sin((Date.now() + i * 86400000) / 1000000) * 8;
            const minTemp = baseTemp + tempVariation - 5;
            const maxTemp = baseTemp + tempVariation + 5;
            
            days.push({
                date: new Date(Date.now() + i * 86400000).toDateString(),
                minTemp: Math.round(minTemp),
                maxTemp: Math.round(maxTemp),
                description: this.getRandomDescription(),
                icon: this.getRandomIcon(),
                humidity: Math.round(60 + Math.random() * 30),
                windSpeed: Math.round(Math.random() * 10),
                hourly: this.generateHourlyData(minTemp, maxTemp, units)
            });
        }
        
        return days;
    }

    // Generate hourly data for a day
    generateHourlyData(minTemp, maxTemp, units) {
        const hours = [];
        for (let i = 0; i < 24; i += 3) {
            const temp = minTemp + (maxTemp - minTemp) * (Math.sin(i / 24 * Math.PI * 2) + 1) / 2;
            hours.push({
                time: `${i.toString().padStart(2, '0')}:00`,
                temp: Math.round(temp),
                description: this.getRandomDescription(),
                icon: this.getRandomIcon(),
                humidity: Math.round(60 + Math.random() * 30),
                windSpeed: Math.round(Math.random() * 10)
            });
        }
        return hours;
    }

    // Get random weather description
    getRandomDescription() {
        const descriptions = [
            'clear sky', 'few clouds', 'scattered clouds', 'broken clouds', 
            'shower rain', 'rain', 'thunderstorm', 'snow', 'mist'
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    // Get random weather icon
    getRandomIcon() {
        const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'];
        return icons[Math.floor(Math.random() * icons.length)];
    }

    // Get detailed weather
    async getDetailedWeather(latitude, longitude, units = 'metric') {
        try {
            const [current, forecast] = await Promise.all([
                this.getCurrentWeather(latitude, longitude, units),
                this.getForecast(latitude, longitude, units)
            ]);

            return {
                current,
                forecast,
                location: {
                    lat: latitude,
                    lon: longitude
                },
                lastUpdated: new Date().toISOString()
            };
        } catch (error) {
            throw error;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

module.exports = new DemoWeatherService();
