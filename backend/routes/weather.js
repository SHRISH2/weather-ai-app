// ✅ UPDATED BACKEND ROUTE FOR 5-DAY FORECAST
const WeatherSearch = require('../models/WeatherSearch');
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// 🔹 GET 5-day forecast + save current snapshot to DB
router.get('/', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(forecastUrl);

    const forecastData = response.data;
    const currentData = forecastData.list[0];

    // Save only current snapshot to DB
    const newSearch = new WeatherSearch({
      city: forecastData.city.name,
      temperature: currentData.main.temp,
      condition: currentData.weather[0].description
    });

    await newSearch.save();

    res.json({
      message: 'Forecast fetched & saved ✅',
      data: {
        city: forecastData.city,
        list: forecastData.list
      }
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// 🔹 GET all past weather searches
router.get('/history', async (req, res) => {
  try {
    const searches = await WeatherSearch.find().sort({ dateSearched: -1 });
    res.json(searches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// 🔹 DELETE a specific weather search by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await WeatherSearch.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Search not found' });
    }
    res.json({ message: 'Search deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete search' });
  }
});

// 🔹 UPDATE a specific weather search by ID
router.put('/:id', async (req, res) => {
  const { city, temperature, condition } = req.body;

  try {
    const updated = await WeatherSearch.findByIdAndUpdate(
      req.params.id,
      { city, temperature, condition },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Search not found' });
    }

    res.json({ message: 'Search updated successfully', updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update search' });
  }
});

module.exports = router;
