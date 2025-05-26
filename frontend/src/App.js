import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import sunAnim from './animations/sunny.json';
import rainAnim from './animations/rain.json';
import cloudAnim from './animations/cloudy.json';
import nightAnim from './animations/night.json';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchWeather = async (queryCity = city) => {
    if (!queryCity) return;
    try {
      const res = await axios.get(`http://localhost:5000/weather?city=${queryCity}`);
      setWeather(res.data.data);
      setCity('');
      setError('');
      setShowModal(true);
      fetchHistory();
    } catch (err) {
      setError('Failed to fetch weather');
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get('http://localhost:5000/weather/history');
    setHistory(res.data);
  };

  const deleteSearch = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/weather/${id}`);
      fetchHistory();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  const getAnimation = () => {
    if (!weather) return sunAnim;
    const main = weather.list[0].weather[0].main.toLowerCase();
    if (main.includes('rain')) return rainAnim;
    if (main.includes('cloud')) return cloudAnim;
    if (main.includes('clear')) return sunAnim;
    return nightAnim;
  };

  const getFiveDayForecast = () => {
    if (!weather || !weather.list) return [];
    const daily = [];
    const seenDates = new Set();
    for (let item of weather.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!seenDates.has(date)) {
        seenDates.add(date);
        daily.push(item);
      }
      if (daily.length === 5) break;
    }
    return daily;
  };

  const getTodayHourly = () => {
    if (!weather || !weather.list) return [];
    const today = weather.list[0].dt_txt.split(' ')[0];
    return weather.list.filter(item => item.dt_txt.includes(today));
  };

  const getTip = () => {
    const condition = weather?.list?.[0]?.weather?.[0]?.main.toLowerCase();
    if (condition.includes('rain')) return 'Carry an umbrella 🌂 and drive safe!';
    if (condition.includes('clear')) return 'It’s sunny 🌞 — stay hydrated and use sunscreen!';
    if (condition.includes('cloud')) return 'Cloudy skies 🌥️ — good for a walk!';
    return 'Stay prepared for changing weather!';
  };

  const getQuote = () => {
    const quotes = [
      "🌟 Wherever you go, no matter what the weather, always bring your own sunshine.",
      "🌟 Some people feel the rain — others just get wet.",
      "🌟 The sound of rain needs no translation.",
      "🌟 Life isn’t about waiting for the storm to pass... it's about learning to dance in the rain.",
      "🌟 Sunshine is delicious, rain is refreshing, wind braces us up, snow is exhilarating."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-tr from-blue-100 to-purple-200 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700">🌦️ Weather Forecast App</h1>

        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={fetchWeather} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Search
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div>
          <h3 className="text-lg font-bold mb-2 border-b pb-1">📜 Search History</h3>
          <ul className="space-y-2">
            {history.map((entry) => (
              <li key={entry._id} className="flex justify-between items-center bg-gray-100 p-2 rounded hover:bg-gray-200">
                <div onClick={() => fetchWeather(entry.city)} className="cursor-pointer">
                  {entry.city} - {entry.temperature}°C - {entry.condition}
                </div>
                <button
                  onClick={() => deleteSearch(entry._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {showModal && weather && (
        <div className="fixed inset-0 bg-white bg-opacity-95 z-50 overflow-y-auto p-4">
          <button
            onClick={() => setShowModal(false)}
            className="float-right bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            🏠 Back to Home
          </button>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Weather Info */}
            <div className="md:col-span-2">
              <Lottie animationData={getAnimation()} loop autoplay className="h-56 md:h-64 w-full mb-4" />
              <h2 className="text-2xl font-bold text-blue-700 mb-2">📍 {weather.city.name}</h2>
              <p>🌡️ {weather.list[0].main.temp}°C</p>
              <p>🌤️ {weather.list[0].weather[0].description}</p>
              <p>💨 {weather.list[0].wind.speed} m/s</p>

              <h3 className="mt-6 text-xl font-semibold">🕒 Today's Hourly Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
                {getTodayHourly().map((item, idx) => (
                  <div key={idx} className="bg-blue-100 p-2 rounded text-center text-sm shadow">
                    <div className="font-medium">{item.dt_txt.split(' ')[1].slice(0, 5)}</div>
                    <div>{item.main.temp}°C</div>
                    <div>{item.weather[0].main}</div>
                  </div>
                ))}
              </div>

              <h3 className="mt-6 text-xl font-semibold">📅 5-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                {getFiveDayForecast().map((item, idx) => (
                  <div key={idx} className="bg-blue-50 p-2 rounded text-center text-sm shadow">
                    <div>{item.dt_txt.split(' ')[0]}</div>
                    <div>{item.weather[0].main}</div>
                    <div>{item.main.temp}°C</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trip + Tip + Quote */}
            <div className="bg-yellow-50 p-4 rounded shadow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold">✈️ Planning a trip?</h3>
                <p className="mt-1">Here are some places near {weather.city.name}!</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Local Museum</li>
                  <li>Scenic Park</li>
                  <li>Historic Temple</li>
                </ul>

                <p className="mt-4 text-green-700 font-semibold">
                  💰 Crazy deals in hotels and restaurants!
                </p>
                <div className="mt-2 flex flex-col gap-2">
                  <a href="https://www.makemytrip.com" target="_blank" rel="noreferrer"
                    className="bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700">MakeMyTrip</a>
                  <a href="https://www.goibibo.com" target="_blank" rel="noreferrer"
                    className="bg-green-600 text-white text-center px-3 py-2 rounded hover:bg-green-700">Goibibo</a>
                </div>
                <div className="mt-4 text-sm italic text-gray-600">
                  💡 {getTip()}
                </div>
              </div>

              <div className="mt-6 text-xs text-right text-gray-500 italic">
                {getQuote()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
