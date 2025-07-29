// server.js
const app = require('./app');
const sequelize = require('./config/db');
const redisClient = require('./utils/redisClient');
const { startNotificationWorker } = require('./workers/notificationWorker');

const PORT = process.env.PORT || 3000;

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
    
    // Test Redis connection
    return new Promise((resolve, reject) => {
      redisClient.on('connect', () => {
        console.log('Connected to Redis');
        resolve();
      });
      
      redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
        reject(err);
      });
    });
  })
  .then(() => {
    // Start notification worker
    startNotificationWorker();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
    process.exit(1);
  });