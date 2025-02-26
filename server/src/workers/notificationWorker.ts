import { Worker, Job } from 'bullmq';
import dotenv from 'dotenv';
import { pool } from '../databases/postgress';
import { io } from '../sockets';
import { NotificationJobData, NotificationRecord } from '../types';

dotenv.config();

const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
};

export const notificationWorker = new Worker<NotificationJobData>(
    'notification-queue',
    async (job: Job<NotificationJobData>) => {
        const { userId, type, details } = job.data;

        /**
         * Insert a new notification row with a JSONB column "details".
         * Postgres allows direct insertion of JS objects if we need to pass them as a parameter
         * (with the pg library).
         * Alternatively, we can do JSON.stringify(details).
         */
        const insertQuery = `
            INSERT INTO notifications (user_id, type, details)
            VALUES ($1, $2, $3)
                RETURNING *;
        `;
        const values = [userId, type, details];

        const result = await pool.query<NotificationRecord>(insertQuery, values);
        const newNotification = result.rows[0];

        // Emit a real-time event (Socket.io) if user is online
        if (io()) {
            io()?.to(userId).emit('notification', newNotification);
            console.log(`Emitted notification to user "${userId}":`, newNotification);
        } else {
            console.log(`Socket.io instance not available for user "${userId}"`);
        }
    },
    { connection }
);