import { Router } from 'express';
import { getNotifications, patchNotifications } from '../controllers/notificationController';

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Retrieve notifications for a user (optionally unread only)
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user to fetch notifications for
 *       - in: query
 *         name: unread
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         required: false
 *         description: If 'true', only unread notifications are returned
 *     responses:
 *       200:
 *         description: List of notifications
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
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: number
 *             required:
 *               - userId
 *               - notificationIds
 *     responses:
 *       200:
 *         description: Notifications marked as read
 */
router.route('/notifications')
  .get(getNotifications)
  .patch(patchNotifications);

export default router;