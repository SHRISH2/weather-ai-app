const mongoose = require('mongoose');

const WeatherSearchSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  dateSearched: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeatherSearch', WeatherSearchSchema);
