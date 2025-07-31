const app = require('./app');
const { sequelize } = require('./models');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start workers
require('./workers/notificationWorker');

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
    process.exit(1);
  });