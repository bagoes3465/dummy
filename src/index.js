const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'connected'
  });
});

// Routes
app.use('/api/backgrounds', require('./routes/backgrounds'));
app.use('/api/mascots', require('./routes/mascots'));
app.use('/api/filters', require('./routes/filters'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/downloads', require('./routes/downloads'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 API health: http://localhost:${PORT}/api/health`);
  console.log(`📚 Backgrounds: http://localhost:${PORT}/api/backgrounds`);
});

module.exports = app;
