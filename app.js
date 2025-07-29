// app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const i18nextBackend = require('i18next-fs-backend');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const errorHandler = require('./utils/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseAllocationRoutes = require('./routes/courseAllocationRoutes');
const activityTrackerRoutes = require('./routes/activityTrackerRoutes');

// Initialize Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize i18n
i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'translations', '{{lng}}.json')
    },
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    saveMissing: true
  });

app.use(i18nextMiddleware.handle(i18next));

// Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/course-offerings', courseAllocationRoutes);
app.use('/api/activity-logs', activityTrackerRoutes);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use(errorHandler);

module.exports = app;