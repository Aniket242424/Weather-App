const axios = require('axios');
const config = require('../../config');

const geocode = async (address) => {
    try {
        // Try MapBox first
        const url = `${config.MAPBOX_BASE_URL}/${encodeURIComponent(address)}.json`;
        const response = await axios.get(url, {
            params: {
                access_token: config.MAPBOX_API_KEY,
                limit: 1,
                types: 'place,locality,neighborhood,address,poi'
            }
        });

        const data = response.data;
        
        if (!data.features || data.features.length === 0) {
            throw new Error('Unable to find location. Please try another search.');
        }

        const feature = data.features[0];
        return {
            longitude: feature.center[0],
            latitude: feature.center[1],
            location: feature.place_name,
            context: feature.context ? feature.context.map(c => c.text).join(', ') : '',
            type: feature.place_type[0],
            relevance: feature.relevance
        };
    } catch (error) {
        // Fallback to free Nominatim service if MapBox fails
        try {
            // MapBox failed, trying free geocoding service
            const fallbackUrl = 'https://nominatim.openstreetmap.org/search';
            const fallbackResponse = await axios.get(fallbackUrl, {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1,
                    addressdetails: 1
                },
                headers: {
                    'User-Agent': 'WeatherAppPro/1.0'
                }
            });

            if (!fallbackResponse.data || fallbackResponse.data.length === 0) {
                throw new Error('Unable to find location. Please try another search.');
            }

            const result = fallbackResponse.data[0];
            return {
                longitude: parseFloat(result.lon),
                latitude: parseFloat(result.lat),
                location: result.display_name,
                context: result.address ? Object.values(result.address).join(', ') : '',
                type: 'fallback',
                relevance: 1.0
            };
        } catch (fallbackError) {
            throw new Error('Unable to find location. Please try another search or check your internet connection.');
        }
    }
};

// Legacy callback support
const geocodeCallback = (address, callback) => {
    geocode(address)
        .then(result => callback(undefined, result))
        .catch(error => callback(error.message, undefined));
};

module.exports = { geocode, geocodeCallback };