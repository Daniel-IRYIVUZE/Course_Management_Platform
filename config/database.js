require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS_Jli:39U1WA9RsAKDRyda',
    database: process.env.DB_NAME || 'defaultdb',
    host: process.env.DB_HOST || 'mysql-355a5c4f-ozoneinventorymanagement.b.aivencloud.com',
    port: process.env.DB_PORT || 24340,
    dialect: 'mysql', // Must be a string literal
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};