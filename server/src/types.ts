/**
 * Enum for top-level notification types, e.g. "ISSUE_STATUS_CHANGED"
 */
export enum NotificationType {
    ISSUE_CREATED = 'ISSUE_CREATED',
    ISSUE_STATUS_CHANGED = 'ISSUE_STATUS_CHANGED',
    ISSUE_ASSIGNEE_CHANGED = 'ISSUE_ASSIGNEE_CHANGED',
    // etc. We can add other type of data
}

/**
 * The JSON details that might be stored in the "details" column.
 * For example, a single ticket update might have:
 * issueKey, oldStatus, newStatus, oldAssignee, newAssignee, message, etc.
 * This is flexible for Jira-like data.
 */
export interface JiraNotificationDetails {
    issueKey?: string;
    issueSummary?: string;
    oldStatus?: string;
    newStatus?: string;
    oldAssignee?: string;
    newAssignee?: string;
    message?: string;
}

/**
 * Data sent to the queue for processing
 */
export interface NotificationJobData {
    userId: string;                     // The user to notify
    type: NotificationType;             // e.g. "ISSUE_STATUS_CHANGED"
    details: JiraNotificationDetails;   // The JSON details
    priority?: number;                  // For queue priority
}

/**
 * Shape of a record in the notifications DB table
 */
export interface NotificationRecord {
    id: number;
    user_id: string;
    type: string;
    details: any;  // JSON object (JiraNotificationDetails) stored in "details" column
    created_at: Date;
    read_at: Date | null;
    is_read: boolean;
}