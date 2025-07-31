const redisClient = require('../config/redis');
const { User } = require('../models');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const NOTIFICATION_QUEUE = 'fat_notifications';
const REMINDER_QUEUE = 'fat_reminders';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const processNotifications = async () => {
  try {
    // Get notification from queue
    const notificationStr = await redisClient.rPop(NOTIFICATION_QUEUE);
    if (!notificationStr) return;

    const notification = JSON.parse(notificationStr);
    console.log('Processing notification:', notification.type);

    // Handle different notification types
    switch (notification.type) {
      case 'manager_alert':
        await handleManagerAlert(notification);
        break;
      default:
        console.log('Unknown notification type:', notification.type);
    }
  } catch (error) {
    console.error('Error processing notification:', error);
  }
};

const processReminders = async () => {
  try {
    // Get reminder from queue
    const reminderStr = await redisClient.rPop(REMINDER_QUEUE);
    if (!reminderStr) return;

    const reminder = JSON.parse(reminderStr);
    console.log('Processing reminder for facilitator:', reminder.facilitatorId);

    // Send reminder email
    await sendReminderEmail(reminder);
  } catch (error) {
    console.error('Error processing reminder:', error);
  }
};

const handleManagerAlert = async (notification) => {
  try {
    // Get all managers
    const managers = await User.findAll({
      where: { role: 'manager' },
      attributes: ['email']
    });

    if (!managers.length) return;

    // Send email to all managers
    const mailOptions = {
      from: `"Zanda College CMS" <${process.env.EMAIL_FROM}>`,
      to: managers.map(m => m.email).join(','),
      subject: 'FAT Submission Alert',
      text: notification.message,
      html: `<p>${notification.message}</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Manager alert email sent');
  } catch (error) {
    console.error('Error sending manager alert email:', error);
  }
};

const sendReminderEmail = async (reminder) => {
  try {
    const facilitator = await User.findByPk(reminder.facilitatorId);
    if (!facilitator) return;

    const mailOptions = {
      from: `"Zanda College CMS" <${process.env.EMAIL_FROM}>`,
      to: facilitator.email,
      subject: 'Reminder: FAT Submission Due',
      text: `Dear ${facilitator.firstName},\n\nThis is a reminder to submit your Facilitator Activity Tracker for week ${reminder.weekNumber}.\n\nBest regards,\nZanda College CMS`,
      html: `<p>Dear ${facilitator.firstName},</p>
             <p>This is a reminder to submit your Facilitator Activity Tracker for week ${reminder.weekNumber}.</p>
             <p>Best regards,<br>Zanda College CMS</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent to:', facilitator.email);
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

// Start workers
setInterval(processNotifications, 5000);
setInterval(processReminders, 60000); // Check every minute

console.log('Notification workers started');