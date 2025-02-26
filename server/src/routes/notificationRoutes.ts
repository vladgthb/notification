import { Router } from 'express';
import {
    getNotifications,
    patchNotifications,
    createNotification
} from '../controllers/notificationController';

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve notifications for a user (optionally only unread)
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID for which to retrieve notifications
 *       - in: query
 *         name: unread
 *         required: false
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: If true, only unread notifications are returned
 *     responses:
 *       200:
 *         description: List of notifications
 *   post:
 *     summary: Create a new notification in the database
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "alice"
 *               type:
 *                 type: string
 *                 example: "ISSUE_STATUS_CHANGED"
 *               details:
 *                 type: object
 *                 properties:
 *                   issueKey:
 *                     type: string
 *                     example: "PROJ-123"
 *                   oldStatus:
 *                     type: string
 *                     example: "Open"
 *                   newStatus:
 *                     type: string
 *                     example: "In Progress"
 *                   message:
 *                     type: string
 *                     example: "Ticket updated."
 *             required:
 *               - userId
 *               - type
 *               - details
 *     responses:
 *       201:
 *         description: Notification created successfully
 *   patch:
 *     summary: Mark notifications as read
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "alice"
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [101, 102]
 *             required:
 *               - userId
 *               - notificationIds
 *     responses:
 *       200:
 *         description: Notifications marked as read
 */
router.route('/notifications')
    .get(getNotifications)
    .post(createNotification)
    .patch(patchNotifications);

export default router;