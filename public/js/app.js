// Modern Weather App Pro Client-Side JavaScript
console.log('🌤️ Weather App Pro - Client-side JavaScript loaded');

// DOM Elements
const weatherForm = document.getElementById('weatherForm');
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const btnText = searchBtn.querySelector('.btn-text');
const loadingSpinner = searchBtn.querySelector('.loading-spinner');
const messageOne = document.getElementById('message-1');
const messageTwo = document.getElementById('message-2');
const weatherDisplay = document.getElementById('weatherDisplay');
const currentWeather = document.getElementById('currentWeather');
const weatherLocation = document.getElementById('weatherLocation');
const weatherTemp = document.getElementById('weatherTemp');
const weatherDesc = document.getElementById('weatherDesc');
const weatherDetails = document.getElementById('weatherDetails');
const forecastGrid = document.getElementById('forecastGrid');

// Utility Functions
function showMessage(element, message, type = 'loading') {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

function hideMessage(element) {
    element.style.display = 'none';
}

function showLoading() {
    btnText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    searchBtn.disabled = true;
    searchBtn.style.opacity = '0.7';
}

function hideLoading() {
    btnText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.style.opacity = '1';
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
}

function formatTemperature(temp) {
    return Math.round(temp);
}

function formatWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Display Current Weather
function displayCurrentWeather(weatherData) {
    const current = weatherData.weather.current;
    
    weatherLocation.textContent = weatherData.location.name;
    weatherTemp.innerHTML = `${formatTemperature(current.temperature)}<span style="font-size: 2rem;">°C</span>`;
    weatherDesc.textContent = current.description;
    
    // Weather Details
    weatherDetails.innerHTML = `
        <div class="weather-detail">
            <div class="label">Feels Like</div>
            <div class="value">${formatTemperature(current.feelsLike)}°C</div>
        </div>
        <div class="weather-detail">
            <div class="label">Humidity</div>
            <div class="value">${current.humidity}%</div>
        </div>
        <div class="weather-detail">
            <div class="label">Pressure</div>
            <div class="value">${current.pressure} hPa</div>
        </div>
        <div class="weather-detail">
            <div class="label">Wind</div>
            <div class="value">${current.windSpeed} m/s ${formatWindDirection(current.windDirection)}</div>
        </div>
        <div class="weather-detail">
            <div class="label">Visibility</div>
            <div class="value">${current.visibility || 'N/A'} km</div>
        </div>
        <div class="weather-detail">
            <div class="label">Sunrise</div>
            <div class="value">${current.sunrise}</div>
        </div>
        <div class="weather-detail">
            <div class="label">Sunset</div>
            <div class="value">${current.sunset}</div>
        </div>
    `;
}

// Display 7-Day Forecast
function displayForecast(forecastData) {
    forecastGrid.innerHTML = '';
    
    forecastData.slice(0, 7).forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        dayElement.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="temp-range">${formatTemperature(day.minTemp)}° / ${formatTemperature(day.maxTemp)}°</div>
            <div class="description">${day.description}</div>
        `;
        
        forecastGrid.appendChild(dayElement);
    });
}

// Display Weather Data
function displayWeatherData(data) {
    if (data.success) {
        displayCurrentWeather(data);
        displayForecast(data.weather.forecast);
        weatherDisplay.style.display = 'block';
        hideMessage(messageOne);
        hideMessage(messageTwo);
        
        // Show success message briefly
        showMessage(messageTwo, `Weather data updated for ${data.location.name}`, 'success');
        setTimeout(() => hideMessage(messageTwo), 3000);
    } else {
        throw new Error(data.error || 'Failed to fetch weather data');
    }
}

// Handle Form Submission
weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const location = locationInput.value.trim();
    if (!location) {
        showMessage(messageOne, 'Please enter a location', 'error');
        return;
    }
    
    showLoading();
    showMessage(messageOne, 'Fetching weather information...', 'loading');
    hideMessage(messageTwo);
    weatherDisplay.style.display = 'none';
    
    try {
        const response = await fetch(`/weather?address=${encodeURIComponent(location)}`);
        const data = await response.json();
        
        if (response.ok) {
            displayWeatherData(data);
        } else {
            throw new Error(data.error || 'Weather service error');
        }
    } catch (error) {
        console.error('Weather fetch error:', error);
        showMessage(messageOne, error.message, 'error');
        weatherDisplay.style.display = 'none';
    } finally {
        hideLoading();
    }
});

// Auto-focus search input
locationInput.focus();

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        locationInput.focus();
    }
});

// Add search history (localStorage)
function saveSearchHistory(location) {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
    if (!history.includes(location)) {
        history.unshift(location);
        history.splice(10); // Keep only last 10 searches
        localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
    }
}

// Load search history
function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
    // You could implement a dropdown here with search history
    console.log('Search history:', history);
}

// Initialize
loadSearchHistory();

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You could register a service worker here for offline capabilities
        console.log('Service Worker support detected');
    });
}
