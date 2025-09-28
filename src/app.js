const path = require('path');
const express = require('express');
const hbs = require('hbs');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const { geocodeCallback } = require('./utils/geocode');
const weatherService = require('./utils/weatherService');
const demoWeatherService = require('./utils/demoWeatherService');
const config = require('../config');

// Store our express application
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://maxcdn.bootstrapcdn.com", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://maxcdn.bootstrapcdn.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://api.openweathermap.org", "https://api.mapbox.com"]
        }
    }
}));

// Enable CORS for API routes
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

// Compression middleware
app.use(compression());

// Define express config
const publicDirectory = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// Set up handlebars for dynamic templates
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

// Customize your server by setting directory to serve
app.use(express.static(publicDirectory));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Test route
app.get('/test', (req, res) => {
    res.render('test');
});

// Main routes
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App Pro',
        name: 'Aniket',
        description: 'Get accurate weather forecasts for any location worldwide'
    });
});


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Weather App Pro',
        name: 'Aniket',
        version: '2.0.0',
        currentDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        features: [
            'Real-time weather data',
            '7-day detailed forecast',
            'Interactive weather maps',
            'Location-based services',
            'Responsive design',
            'Multiple weather providers'
        ]
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help & Support',
        name: 'Aniket',
        helpText: 'Get help with using Weather App Pro',
        faqs: [
            {
                question: 'How do I search for weather?',
                answer: 'Simply enter a city name, postal code, or address in the search box on the homepage.'
            },
            {
                question: 'What weather information is provided?',
                answer: 'Current temperature, humidity, wind speed, 7-day forecast, and detailed hourly data.'
            },
            {
                question: 'Can I get weather for any location?',
                answer: 'Yes! Our app supports worldwide locations using advanced geocoding services.'
            }
        ]
    });
});

// Enhanced weather API endpoint
app.get('/weather', async (req, res) => {
    try {
        if (!req.query.address) {
            return res.status(400).json({
                error: 'Address parameter is required',
                example: '/weather?address=London'
            });
        }

        // Get geocoding data
        geocodeCallback(req.query.address, async (error, geocodeData) => {
            if (error) {
                return res.status(404).json({ error });
            }

            try {
                // Get detailed weather data (try real service first, fallback to demo)
                let weatherData;
                try {
                    weatherData = await weatherService.getDetailedWeather(
                        geocodeData.latitude, 
                        geocodeData.longitude,
                        req.query.units || 'metric'
                    );
                } catch (weatherError) {
                    // Real weather service failed, using demo data
                    weatherData = await demoWeatherService.getDetailedWeather(
                        geocodeData.latitude, 
                        geocodeData.longitude,
                        req.query.units || 'metric'
                    );
                }

                res.json({
                    success: true,
                    location: {
                        name: geocodeData.location,
                        context: geocodeData.context,
                        type: geocodeData.type,
                        coordinates: {
                            lat: geocodeData.latitude,
                            lon: geocodeData.longitude
                        }
                    },
                    weather: weatherData,
                    searchQuery: req.query.address,
                    timestamp: new Date().toISOString()
                });
            } catch (weatherError) {
                res.status(500).json({ 
                    error: 'Weather service temporarily unavailable',
                    details: weatherError.message 
                });
            }
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});


// New API endpoints for enhanced functionality
app.get('/api/current/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const units = req.query.units || 'metric';
        
        const weatherData = await weatherService.getCurrentWeather(lat, lon, units);
        res.json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch current weather',
            details: error.message
        });
    }
});

app.get('/api/forecast/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const units = req.query.units || 'metric';
        
        const forecastData = await weatherService.getForecast(lat, lon, units);
        res.json({
            success: true,
            data: forecastData
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch forecast',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        services: {
            weather: 'operational',
            geocoding: 'operational'
        }
    });
});



app.get('/help/*',(req,res)=>{
    res.render('error',{
        errorMessage:'Help Page Not Found'
    })
})

app.get('*',(req,res)=>{
    res.render('error',{
        errorMessage:'404 Page Not Found'
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`🚀 Weather App Pro is running on port ${PORT}`);
    if (config.NODE_ENV === 'development') {
        console.log(`📊 Environment: ${config.NODE_ENV}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
    }
});