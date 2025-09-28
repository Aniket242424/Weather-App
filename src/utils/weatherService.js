const axios = require('axios');
const config = require('../../config');

class WeatherService {
    constructor() {
        this.cache = new Map();
        this.cacheTTL = config.CACHE_TTL * 1000; // Convert to milliseconds
    }

    // Get current weather with detailed information
    async getCurrentWeather(latitude, longitude, units = 'metric') {
        const cacheKey = `current_${latitude}_${longitude}_${units}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
        }

        try {
            const url = `${config.OPENWEATHER_BASE_URL}/weather`;
            const response = await axios.get(url, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: config.OPENWEATHER_API_KEY,
                    units: units
                }
            });

            const data = this.formatCurrentWeather(response.data);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            throw new Error(`Weather service error: ${error.response?.data?.message || 'Service unavailable'}`);
        }
    }

    // Get 7-day forecast
    async getForecast(latitude, longitude, units = 'metric') {
        const cacheKey = `forecast_${latitude}_${longitude}_${units}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTTL) {
                return cached.data;
            }
        }

        try {
            const url = `${config.OPENWEATHER_BASE_URL}/forecast`;
            const response = await axios.get(url, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: config.OPENWEATHER_API_KEY,
                    units: units
                }
            });

            const data = this.formatForecast(response.data);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            throw new Error(`Forecast service error: ${error.response?.data?.message || 'Service unavailable'}`);
        }
    }

    // Get detailed weather information including alerts
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

    // Format current weather data
    formatCurrentWeather(data) {
        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            visibility: data.visibility ? Math.round(data.visibility / 1000) : null,
            uvIndex: null, // Not available in free tier
            windSpeed: data.wind?.speed || 0,
            windDirection: data.wind?.deg || 0,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            main: data.weather[0].main,
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
            country: data.sys.country,
            city: data.name,
            timestamp: new Date().toISOString()
        };
    }

    // Format forecast data
    formatForecast(data) {
        const dailyForecast = {};
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    date: date,
                    minTemp: item.main.temp_min,
                    maxTemp: item.main.temp_max,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                    humidity: item.main.humidity,
                    windSpeed: item.wind?.speed || 0,
                    hourly: []
                };
            }
            
            // Update min/max temps
            dailyForecast[date].minTemp = Math.min(dailyForecast[date].minTemp, item.main.temp_min);
            dailyForecast[date].maxTemp = Math.max(dailyForecast[date].maxTemp, item.main.temp_max);
            
            // Add hourly data
            dailyForecast[date].hourly.push({
                time: new Date(item.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon,
                humidity: item.main.humidity,
                windSpeed: item.wind?.speed || 0
            });
        });

        return Object.values(dailyForecast).slice(0, 7); // Return 7 days
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

module.exports = new WeatherService();
