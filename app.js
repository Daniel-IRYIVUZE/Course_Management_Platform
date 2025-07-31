const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const redisClient = require('./config/redis');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseAllocationRoutes = require('./routes/courseAllocationRoutes');
const activityTrackerRoutes = require('./routes/activityTrackerRoutes');

// Initialize express
const app = express();

// Enable CORS
app.use(cors());

// Security headers
app.use(helmet());

// Logger
app.use(morgan('dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Internationalization
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'translations/{{lng}}.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'fr', 'rw'],
    saveMissing: true
  });

app.use(i18nextMiddleware.handle(i18next));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Zanda College Course Management Platform API',
      version: '1.0.0',
      description: 'API documentation for Zanda College CMS',
      contact: {
        name: 'Zanda College IT Support',
        email: 'it-support@zandacollege.edu.rw'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/course-offerings', courseAllocationRoutes);
app.use('/api/activity-logs', activityTrackerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;