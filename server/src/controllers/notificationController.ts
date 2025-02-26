import { Request, Response, NextFunction } from 'express';
import { pool } from '../databases/postgress';
import { NotificationJobData, NotificationRecord } from '../types';

/**
 * GET /notifications
 * - Optionally filter unread via ?unread=true
 */
export async function getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { userId, unread } = req.query;

        if (!userId || typeof userId !== 'string') {
            res.status(400).json({ error: 'Missing or invalid userId in query params' });
            return;
        }

        // Build a dynamic WHERE clause
        let baseQuery = `
            SELECT *
            FROM notifications
            WHERE user_id = $1
        `;
        const params: any[] = [userId];

        if (unread === 'true') {
            baseQuery += ' AND is_read = false';
        }

        baseQuery += ' ORDER BY created_at DESC';

        const result = await pool.query<NotificationRecord>(baseQuery, params);
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
}

/**
 * PATCH /notifications
 * - Mark notifications as read.
 * - Body: { userId: string, notificationIds: number[] }
 * Example:
 * {
 *   "userId": "alice",
 *   "notificationIds": [101, 102, 103]
 * }
 */
export async function patchNotifications(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { userId, notificationIds } = req.body as {
            userId: string;
            notificationIds: number[];
        };

        if (!userId || !notificationIds?.length) {
            res.status(400).json({ error: 'Missing userId or notificationIds' });
            return;
        }

        const updateQuery = `
            UPDATE notifications
            SET is_read = true, read_at = NOW()
            WHERE user_id = $1
              AND id = ANY($2)
                RETURNING *;
        `;
        const values = [userId, notificationIds];

        const result = await pool.query<NotificationRecord>(updateQuery, values);
        res.status(200).json({
            updatedCount: result.rowCount,
            updatedRecords: result.rows
        });
    } catch (err) {
        next(err);
    }
}

/**
 * POST /notifications
 * - Create a new notification directly in PostgreSQL.
 * - Request body should include: userId, type, details.
 *
 * Example:
 * {
 *   "userId": "alice",
 *   "type": "ISSUE_STATUS_CHANGED",
 *   "details": {
 *     "issueKey": "PROJ-123",
 *     "oldStatus": "Open",
 *     "newStatus": "In Progress",
 *     "message": "Ticket updated."
 *   }
 * }
 */
export async function createNotification(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { userId, type, details } = req.body as NotificationJobData;
        if (!userId || !type || !details) {
            res.status(400).json({ error: 'Missing required fields: userId, type, details' });
            return;
        }
        const insertQuery = `
            INSERT INTO notifications (user_id, type, details)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userId, type, details];
        const result = await pool.query<NotificationRecord>(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
}