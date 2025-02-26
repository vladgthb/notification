# Notification Service

A Notification Service for a Jira-like task management system built with:

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Redis, BullMQ, Socket.io, Swagger (OpenAPI)
- **Frontend:** React, TypeScript, Material-UI (MUI), Socket.io Client, Axios
- **Deployment:** Docker & Docker Compose

This project supports asynchronous notification processing via a job queue (BullMQ) and real‑time push notifications (Socket.io). Notifications are stored in PostgreSQL (with task details in a JSONB column) and the UI automatically updates without page refresh.

---
![alt text](https://github.com/vladgthb/notification/blob/main/images/backend.png)
![alt text](https://github.com/vladgthb/notification/blob/main/images/functionality.png)
---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [How To Check Functionality](#check)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
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