// workers/notificationWorker.js
const redis = require('redis');
const { promisify } = require('util');
const redisClient = require('../utils/redisClient');
const Notification = require('../models').Notification;
const emailService = require('../services/emailService');

// Promisify Redis commands
const brpopAsync = promisify(redisClient.brpop).bind(redisClient);

async function processNotifications() {
  console.log('Notification worker started...');
  
  while (true) {
    try {
      // Blocking pop from notifications queue (waits indefinitely)
      const result = await brpopAsync('notifications', 0);
      const notification = JSON.parse(result[1]);

      // Save to database
      await Notification.create({
        userId: notification.userId,
        type: notification.type,
        message: notification.message,
        data: notification.data,
        status: 'pending'
      });

      // Send email (in a real app, you'd implement this)
      // await emailService.sendNotificationEmail(notification);

      console.log('Processed notification:', notification);
    } catch (err) {
      console.error('Error processing notification:', err);
    }
  }
}

processNotifications();