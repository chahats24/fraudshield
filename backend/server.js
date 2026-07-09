const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');
const reportsRoute = require('./routes/reports');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoute);
app.use('/api/reports', reportsRoute);

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));