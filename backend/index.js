const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Fixed CORS for React frontend
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    // Remove deprecated options
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
const weatherRoutes = require('./routes/weather');
app.use('/weather', weatherRoutes);

// Start server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
