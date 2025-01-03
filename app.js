const express = require('express');
const cors = require('cors');  // Import CORS
const axios = require('axios'); // To make requests to external APIs like Google Maps

const authRoutes = require('./routes/authRoutes'); // Import routes
const favoritesRoutes = require('./routes/favoritesRoutes');
require('dotenv').config(); // Load environment variables

const app = express();

// CORS Configuration
app.use(cors({
    origin: '*', // Adjust as needed, or use '*' for all origins
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow authorization header
}));

app.use(express.json()); // Parse JSON bodies

// Google Maps Proxy Route
app.get('/api/ev-chargers', async (req, res) => {
  const { location, radius } = req.query;
  const googleApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Ensure you have the API key in your .env file
  const googleMapsUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  try {
    const response = await axios.get(googleMapsUrl, {
      params: {
        location,
        radius,
        type: 'charging_station',
        keyword: 'EV Charger',
        key: googleApiKey, // Pass your Google API key
         fields: 'name,geometry,photos,vicinity,rating,user_ratings_total'
      },
    });
 
    res.json(response.data);  // Send the data from Google Maps API to the frontend
  } catch (error) {
    console.error("Error fetching from Google Maps API:", error);
    res.status(500).send("Failed to fetch data from Google Maps API.");
  }
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);

module.exports = app;
