const { Queue } = require('bullmq');
require('dotenv').config();

const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

const notificationQueue = new Queue('notification-queue', { connection });

module.exports = notificationQueue;