const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/restaurant')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Import Routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');

// Use Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📌 API Endpoints:');
  console.log('  GET  /api/menu');
  console.log('  POST /api/menu');
  console.log('  GET  /api/orders');
  console.log('  POST /api/orders');
  console.log('  PATCH /api/orders/:id/status');
  console.log('  GET  /api/tables');
  console.log('  POST /api/tables');
  console.log('  PATCH /api/tables/:id/reserve');
});