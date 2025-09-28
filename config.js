// Configuration file for Weather App Pro
module.exports = {
    // API Keys - Replace with your actual keys
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || 'ac027af8f8fdfedceef7e783cafb139c',
    MAPBOX_API_KEY: process.env.MAPBOX_API_KEY || 'your_mapbox_api_key_here',
    WEATHERAPI_KEY: process.env.WEATHERAPI_KEY || 'your_weatherapi_key_here',
    
    // Application Settings
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CACHE_TTL: process.env.CACHE_TTL || 300, // 5 minutes
    
    // API URLs
    OPENWEATHER_BASE_URL: 'https://api.openweathermap.org/data/2.5',
    MAPBOX_BASE_URL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    WEATHERAPI_BASE_URL: 'https://api.weatherapi.com/v1'
};
