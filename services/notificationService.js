const redisClient = require('../config/redis');
const { CourseOffering, User } = require('../models');

const NOTIFICATION_QUEUE = 'fat_notifications';
const REMINDER_QUEUE = 'fat_reminders';

const addNotification = async (type, data) => {
  try {
    const notification = {
      type,
      data,
      createdAt: new Date().toISOString()
    };

    await redisClient.lPush(NOTIFICATION_QUEUE, JSON.stringify(notification));
    console.log('Notification added to queue:', type);
  } catch (error) {
    console.error('Error adding notification:', error);
  }
};

const addReminder = async (facilitatorId, courseOfferingId, weekNumber) => {
  try {
    const reminder = {
      facilitatorId,
      courseOfferingId,
      weekNumber,
      createdAt: new Date().toISOString()
    };

    await redisClient.lPush(REMINDER_QUEUE, JSON.stringify(reminder));
    console.log('Reminder added to queue for facilitator:', facilitatorId);
  } catch (error) {
    console.error('Error adding reminder:', error);
  }
};

const sendManagerAlert = async (facilitatorId, courseOfferingId, weekNumber, status) => {
  try {
    const facilitator = await User.findByPk(facilitatorId);
    const courseOffering = await CourseOffering.findByPk(courseOfferingId, {
      include: [
        { model: Module, as: 'module' },
        { model: Cohort, as: 'cohort' }
      ]
    });

    const alert = {
      type: 'manager_alert',
      message: `Facilitator ${facilitator.firstName} ${facilitator.lastName} has ${status} FAT for ${courseOffering.module.name} (${courseOffering.cohort.name}) - Week ${weekNumber}`,
      facilitatorId,
      courseOfferingId,
      weekNumber,
      status,
      createdAt: new Date().toISOString()
    };

    await redisClient.lPush(NOTIFICATION_QUEUE, JSON.stringify(alert));
    console.log('Manager alert sent for facilitator:', facilitatorId);
  } catch (error) {
    console.error('Error sending manager alert:', error);
  }
};

module.exports = {
  addNotification,
  addReminder,
  sendManagerAlert
};