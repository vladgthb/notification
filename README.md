# Notification Service

A Notification Service for a Jira-like task management system built with:

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Redis, BullMQ, Socket.io, Swagger (OpenAPI)
- **Frontend:** React, TypeScript, Material-UI (MUI), Socket.io Client, Axios
- **Deployment:** Docker & Docker Compose

This project supports asynchronous notification processing via a job queue (BullMQ) and real‑time push notifications (Socket.io). Notifications are stored in PostgreSQL (with task details in a JSONB column) and the UI automatically updates without page refresh.

---

![alt text](https://github.com/vladgthb/notification/blob/main/images/backend.png)

---

![alt text](https://github.com/vladgthb/notification/blob/main/images/functionality.png)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [How To Check Functionality](#check)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

---
## Overview

This Notification Service is designed for a Jira-like task management system. It allows:

- **Creation of notifications:** A REST endpoint adds jobs to BullMQ; a worker inserts notifications into PostgreSQL and emits real‑time events.
- **Real‑time updates:** Connected clients receive notifications via Socket.io without needing to refresh the page.
- **UI display:** A React application using MUI displays a notification icon with a badge. Clicking the icon shows a pop-up menu with notification details; clicking an item marks it as read.

---

## Architecture

The system consists of four main services:

1. **PostgreSQL:** Stores notifications in a `notifications` table with a JSONB column (`details`) for task information.
2. **Redis:** Used by BullMQ for job queuing.
3. **Backend Server:** A Node.js/Express API (with TypeScript) that processes REST endpoints, queues jobs, and emits Socket.io events.
4. **Frontend Client:** A React application (TypeScript, MUI) that connects via Socket.io for real‑time notifications.

The components are containerized using Docker and orchestrated by Docker Compose.

```
               ┌───────────────────────────────────────────────────┐
               │                  Client (React)                   │
               │  (TypeScript + Socket.IO for real-time updates)   │
               └──────────────────────────┬────────────────────────┘
                                          │ WebSocket / HTTP
                                          ▼
┌──────────────────────────────────────────┴───────────────────────────────────────────┐
│                  API Server (Express + TypeScript)                                   │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │  • Exposes REST Endpoints: /send-notification, /notifications, etc.           │   │
│  │  • Maintains WebSocket connections with Socket.IO                             │   │
│  │  • Publishes notification jobs to BullMQ queue                                │   │
│  └───────────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                             │
│                                        ▼                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │        BullMQ (Notifications Queue)                                           │   │
│  │  • Redis as a backend                                                         │   │
│  │  • Processes notification jobs in Worker                                      │   │
│  └───────────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                             │
│                                        ▼                                             │
│  ┌───────────────────────────────────────────────────────────────────────────────┐   │
│  │                  PostgreSQL Database                                          │   │
│  │  • Stores notifications (read/unread status)                                  │   │
│  │  • Scalable and indexed for high-volume operations                            │   │
│  └───────────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure
```
notification/
├── docker-compose.yml
├── db-init/
│   └── 00-create-notifications.sql  # Migration file For Postgress in the Docker
├── server/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── server.ts                # Entrypoint for Express server
│   │   ├── socket.ts                # For Socket Emit Initialization
│   │   ├── app.ts
│   │   ├── types.ts
│   │   ├── routes/
│   │   │   ├── notificationRoutes.ts
│   │   ├── controllers/
│   │   │   ├── notificationController.ts
│   │   ├── swagger/
│   │   │   ├── swagger.ts
│   │   ├── workers/
│   │   │   ├── notificationWorker.ts
│   │   ├── jobs/
│   │   │   ├── notificationQueue.ts
│   │   └── databases/
│   │       └── postgress.ts
├── client/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── api.ts
│   │   └── socket.ts               # For Socket Listener Initialization
└── README.md
```

---

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/)
- (For local development) [Node.js](https://nodejs.org/) (if you choose not to use Docker for building)

---

## Installation & Setup

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:vladgthb/notification.git
   cd notification
   ```

2. **Configure Environment Variables:**
   Server: Create a server/.env file (if not already present) with:
   ```shell
    POSTGRES_HOST=postgres
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=notifications_db

    REDIS_HOST=redis
    REDIS_PORT=6379

    PORT=4000
   ```
   
3. **Install Dependencies Locally (Optional - Only for dev):**
   If you plan to run parts of the project locally without Docker:
   •	For the server:
    ```shell
    cd server
    npm install
    npm run build
    ```
   •	For the client:
    ```shell
    cd client
    npm install
    ```

---

## Running the Application
The recommended method is to use Docker Compose, which will spin up all services:

1. **Build & Start Containers:**

   From the root directory:
   ```shell
   docker-compose up --build
   ```

2. **Access the Services:**

   •	Backend API: http://localhost:4000

   •	Swagger UI: http://localhost:4000/api-docs

   •	Frontend Client: http://localhost:3000

3.	**Stop the Application**:

   To stop and remove the containers (and optionally volumes):
   ```shell
   docker-compose down
   ```

---

## API Documentation (Swagger)

•	The API is documented using Swagger.

•	Visit http://localhost:4000/api-docs to view the interactive API documentation.

•	The /notifications endpoint supports:

•	GET: Retrieve notifications (optionally filter by unread=true via query params).

•	POST: Create a new notification by adding a job to the queue.

•	PATCH: Mark notifications as read.

The POST endpoint requires a JSON body that includes fields like userId, type, and a details object (which must include issueKey to link the notification to the original task).
