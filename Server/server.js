require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define the schema for daily summary
const DailySummarySchema = new mongoose.Schema({
  date: { type: String, unique: true },
  avgTemp: Number,
  maxTemp: Number,
  minTemp: Number,
  weatherCondition: Object,
  dominantWeather: String
});

// Create a model from the schema
const DailySummary = mongoose.model('DailySummary', DailySummarySchema);

// API endpoint to save daily summary
app.post('/api/save-daily-summary', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingSummary = await DailySummary.findOne({ date: today });
    
    if (!existingSummary) {
      const newSummary = new DailySummary({
        ...req.body,
        date: today,
      });
      await newSummary.save();
      res.status(201).json({ message: 'Daily summary saved successfully' });
    } else {
      res.status(200).json({ message: 'Daily summary for today already exists' });
    }
  } catch (error) {
    console.error('Error saving daily summary:', error);
    res.status(500).json({ error: 'Failed to save daily summary' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
