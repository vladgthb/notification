import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Notification Service API',
            version: '1.0.0',
            description:
                'API Documentation for the Notification Service. This endpoint handles retrieval (GET), creation (POST), and updating (PATCH) of notifications.',
        },
        components: {
            schemas: {
                NotificationRecord: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            example: 1,
                        },
                        user_id: {
                            type: 'string',
                            example: 'alice',
                        },
                        type: {
                            type: 'string',
                            example: 'ISSUE_STATUS_CHANGED',
                        },
                        details: {
                            type: 'object',
                            example: {
                                issueKey: 'PROJ-123',
                                oldStatus: 'Open',
                                newStatus: 'In Progress',
                            },
                        },
                        created_at: {
                            type: 'string',
                            format: 'date-time',
                            example: '2023-04-01T10:00:00.000Z',
                        },
                        read_at: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            example: null,
                        },
                        is_read: {
                            type: 'boolean',
                            example: false,
                        },
                    },
                },
                NotificationsPatchRequest: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            example: 'alice',
                        },
                        notificationIds: {
                            type: 'array',
                            items: {
                                type: 'number',
                            },
                            example: [101, 102, 103],
                        },
                    },
                    required: ['userId', 'notificationIds'],
                },
                NotificationCreateRequest: {
                    type: 'object',
                    properties: {
                        userId: {
                            type: 'string',
                            example: 'alice',
                            description: 'The ID of the user to receive the notification.',
                        },
                        type: {
                            type: 'string',
                            example: 'ISSUE_STATUS_CHANGED',
                            description: 'Type of the notification (e.g. ISSUE_STATUS_CHANGED).',
                        },
                        details: {
                            type: 'object',
                            properties: {
                                issueKey: {
                                    type: 'string',
                                    example: 'PROJ-123',
                                    description:
                                        'The unique identifier for the original task request. This field must correspond to the original task.',
                                },
                                issueSummary: {
                                    type: 'string',
                                    example: 'Task: Update login feature',
                                    description: 'A brief summary of the task.',
                                },
                                oldStatus: {
                                    type: 'string',
                                    example: 'Open',
                                },
                                newStatus: {
                                    type: 'string',
                                    example: 'In Progress',
                                },
                                oldAssignee: {
                                    type: 'string',
                                    example: 'bob',
                                },
                                newAssignee: {
                                    type: 'string',
                                    example: 'alice',
                                },
                                message: {
                                    type: 'string',
                                    example: 'Ticket updated.',
                                },
                            },
                            description:
                                'A JSON object containing additional details regarding the notification. The "issueKey" is required and must match the original task request.',
                        },
                        priority: {
                            type: 'number',
                            example: 1,
                            description: 'Priority for processing the notification.',
                        },
                    },
                    required: ['userId', 'type', 'details'],
                },
            },
        },
        paths: {
            '/notifications': {
                get: {
                    summary: 'Retrieve notifications for a user',
                    tags: ['Notifications'],
                    parameters: [
                        {
                            name: 'userId',
                            in: 'query',
                            required: true,
                            schema: {
                                type: 'string',
                            },
                            description: 'The user ID to retrieve notifications for',
                        },
                        {
                            name: 'unread',
                            in: 'query',
                            required: false,
                            schema: {
                                type: 'string',
                                enum: ['true', 'false'],
                            },
                            description:
                                'Optional. If set to "true", only unread notifications are returned',
                        },
                    ],
                    responses: {
                        '200': {
                            description: 'List of notifications',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/NotificationRecord',
                                        },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Bad Request',
                        },
                    },
                },
                post: {
                    summary: 'Create a new notification in the database',
                    tags: ['Notifications'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/NotificationCreateRequest',
                                },
                            },
                        },
                    },
                    responses: {
                        '201': {
                            description: 'Notification created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/NotificationRecord',
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Bad Request',
                        },
                    },
                },
                patch: {
                    summary: 'Mark notifications as read',
                    tags: ['Notifications'],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/NotificationsPatchRequest',
                                },
                            },
                        },
                    },
                    responses: {
                        '200': {
                            description: 'Notifications marked as read',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            updatedCount: {
                                                type: 'number',
                                                example: 2,
                                            },
                                            updatedRecords: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/NotificationRecord',
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        '400': {
                            description: 'Bad Request',
                        },
                    },
                },
            },
        },
    },
    apis: []
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}