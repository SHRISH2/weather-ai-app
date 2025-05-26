# 🌦️ Weather Forecast App (Full Stack)

This is a full-stack weather forecast application built as part of the PM Accelerator technical assessment for the AI Engineer Internship.

It allows users to:
- Search any city and view real-time weather.
- View 5-day forecast and today's hourly weather.
- Save, edit, delete weather search history.
- Enjoy animated weather UI and interactive travel tips.

---

## 🚀 Features

- 🔍 Search by city (using Enter or button)
- 🎬 Animated weather popup using Lottie
- 🌤️ Dynamic background per weather condition
- 🕒 Today’s hourly forecast
- 📅 5-day forecast with daily snapshots
- 🧠 AI-inspired quote & useful weather tip
- 🗑️ Delete & edit history entries
- ✈️ “Planning a trip?” travel module with links
- ☁️ Responsive, polished design using Tailwind CSS

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, Lottie, React Select
- **Backend:** Node.js, Express.js, MongoDB Atlas
- **API:** OpenWeatherMap API (forecast endpoint)

---

## ⚙️ Setup Instructions

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/weather-ai-app.git
cd weather-ai-app

📦 2. Install Dependencies
Backend
bash

cd backend
npm install

Frontend
bash

cd ../frontend
npm install

🔐 3. Environment Variables
Create a .env file inside backend/ folder:

ini


PORT=5000
MONGO_URI=your_mongodb_connection_string
WEATHER_API_KEY=your_openweather_api_key
❗ Do NOT commit this file to GitHub.

▶️ 4. Run the App
Start Backend
bash

cd backend
npx nodemon index.js

Start Frontend
bash

cd ../frontend
npm start

Open browser at: http://localhost:3000

📷 Demo Preview
[Include video demo link here once recorded]

👤 Author
Shrish Rahav G