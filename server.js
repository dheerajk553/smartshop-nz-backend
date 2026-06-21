const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { initializeApp, cert } = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/v1', (req, res) => {
  res.json({ message: 'SmartShop NZ API v1 running' });
});
app.use('/v1/products', require('./routes/productRoutes'));
app.use('/v1/shopping-list', require('./routes/shoppingListRoutes'));
app.use('/v1/auth', require('./routes/authRoutes'));
app.use('/v1/lists', require('./routes/shoppingListRoutes'));
app.use('/v1/alerts', require('./routes/dealAlertRoutes')); // Route file will be added later
app.use('/v1/zones', require('./routes/zoneRoutes'));

// Scheduler
require('./services/scheduler');

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SmartShop NZ API v1 running' });
});

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
  directConnection: false
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
})
.catch(err => console.error('MongoDB error:', err.message));