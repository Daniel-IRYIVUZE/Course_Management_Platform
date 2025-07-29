// services/notificationService.js
const redis = require('redis');
const { promisify } = require('util');
const redisClient = require('../utils/redisClient');
const User = require('../models').User;

// Promisify Redis commands
const lpushAsync = promisify(redisClient.lpush).bind(redisClient);
const rpopAsync = promisify(redisClient.rpop).bind(redisClient);
const publishAsync = promisify(redisClient.publish).bind(redisClient);

exports.sendNotification = async ({ type, userId, message, data }) => {
  try {
    const notification = {
      type,
      userId,
      message,
      data,
      createdAt: new Date().toISOString()
    };

    // Add to notification queue
    await lpushAsync('notifications', JSON.stringify(notification));

    // Publish event for real-time notifications
    await publishAsync('notification_channel', JSON.stringify(notification));

    return true;
  } catch (err) {
    console.error('Error sending notification:', err);
    return false;
  }
};

exports.checkMissedDeadlines = async () => {
  try {
    // This would be called by a scheduled job to check for missed deadlines
    const facilitators = await User.findAll({ where: { role: 'facilitator' } });
    const currentWeek = getCurrentWeekNumber();
    
    for (const facilitator of facilitators) {
      const facilitatorModel = await Facilitator.findOne({ where: { userId: facilitator.id } });
      const courseOfferings = await CourseOffering.findAll({ where: { facilitatorId: facilitatorModel.id } });
      
      for (const offering of courseOfferings) {
        const log = await ActivityTracker.findOne({ 
          where: { 
            courseOfferingId: offering.id,
            weekNumber: currentWeek
          } 
        });

        if (!log) {
          await sendNotification({
            type: 'missed_deadline',
            userId: facilitator.id,
            message: `Missed activity log submission for week ${currentWeek}`,
            data: { courseOfferingId: offering.id, weekNumber: currentWeek }
          });

          // Also notify managers
          const managers = await User.findAll({ where: { role: 'manager' } });
          for (const manager of managers) {
            await sendNotification({
              type: 'facilitator_missed_deadline',
              userId: manager.id,
              message: `Facilitator ${facilitator.name} missed activity log for week ${currentWeek}`,
              data: { 
                facilitatorId: facilitator.id,
                courseOfferingId: offering.id,
                weekNumber: currentWeek 
              }
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Error checking missed deadlines:', err);
  }
};

function getCurrentWeekNumber() {
  // Implementation to get current academic week number
  return Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
}