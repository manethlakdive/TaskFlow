# TaskFlow Backend

Express REST API with in-memory mock data (no database yet) that serves the TaskFlow (SyncBoard) frontend.

## Overview

This backend provides the API layer for TaskFlow: authentication, board and task management, team members, and invites. Data is currently stored in memory and resets when the server restarts. Persistent storage with MongoDB, real authentication (JWT), automated testing, and real-time updates with Socket.io are planned for later milestones.

## Tech Stack

- Node.js
- Express
- In-memory mock data store

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
cd backend
npm install
npm run dev
```

Server starts at **http://localhost:5000**

## Project Structure

```
backend/
├── data/
│   └── store.js          # In-memory mock data store
├── routes/
│   ├── auth.routes.js
│   ├── board.routes.js
│   ├── invite.routes.js
│   └── member.routes.js
├── server.js
└── package.json
```

## API Endpoints

| Method | Endpoint                          | Description                    |
|--------|------------------------------------|---------------------------------|
| POST   | `/api/auth/login`                 | Log in with email and password  |
| POST   | `/api/auth/register`              | Register a new user             |
| GET    | `/api/boards`                     | Get all columns and tasks       |
| POST   | `/api/boards/tasks`               | Create a task in a column       |
| PATCH  | `/api/boards/tasks/:taskId/move`  | Move a task to another column   |
| GET    | `/api/members`                    | Get the team members list       |
| POST   | `/api/invites`                    | Invite a new team member        |

A full Postman collection (`SyncBoard.postman_collection.json`) is included in this folder for testing every endpoint. Set the `baseUrl` variable to `http://localhost:5000`.

## Test Accounts (Mock Data)

| Email                | Password |
|-----------------------|----------|
| amila@example.com     | 123456   |
| maneth@example.com    | 123456   |

Alternatively, register a new account via `POST /api/auth/register` or the Register form on the frontend.

## Status

Working REST API with mock data. Database persistence, real authentication, and real-time sync are planned for upcoming milestones.