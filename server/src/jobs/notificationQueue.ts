import { Queue } from 'bullmq';
import dotenv from 'dotenv';
import { NotificationJobData } from '../types';

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
};

export const notificationQueue = new Queue<NotificationJobData>('notification-queue', {
    connection,
});