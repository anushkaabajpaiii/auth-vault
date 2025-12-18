const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON request body
app.use(cookieParser());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AuthVault API running' });
});

// Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server after DB connection
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });
