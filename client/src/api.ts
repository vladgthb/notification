import axios from 'axios';

const BASE_URL = 'http://localhost:4000'; // Adjust if needed

export interface NotificationRecord {
    id: number;
    user_id: string;
    type: string;
    details: any; // Jira-like details
    created_at: string;
    read_at: string | null;
    is_read: boolean;
}

export async function fetchNotifications(userId: string, unreadOnly?: boolean) {
    const params = { userId };
    if (unreadOnly) {
        // @ts-ignore
        params['unread'] = 'true';
    }
    const res = await axios.get<NotificationRecord[]>(`${BASE_URL}/notifications`, { params });
    return res.data;
}

export async function markNotificationsAsRead(userId: string, notificationIds: number[]) {
    const res = await axios.patch(`${BASE_URL}/notifications`, {
        userId,
        notificationIds
    });
    return res.data; // { updatedCount, updatedRecords }
}