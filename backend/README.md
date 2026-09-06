# TaskFlow Backend

Express REST API for TaskFlow (SyncBoard), now backed by MongoDB instead of the old in-memory mock store.

## Overview

This backend provides the API layer for TaskFlow: authentication, board and task management, team members, and invites. Data is persisted in MongoDB via Mongoose. Real authentication (JWT) and real-time updates with Socket.io are planned for later milestones.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- A MongoDB connection (local install or a free MongoDB Atlas cluster)

### Installation

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI to your own connection string
npm run seed   # first time only — populates starter users, members, board
npm run dev
```

Server starts at **http://localhost:5000**

See `MONGODB_MIGRATION_GUIDE.md` in the project root for the full setup walkthrough.

## Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.model.js
│   ├── Member.model.js
│   └── Board.model.js     # embeds columns + tasks
├── routes/
│   ├── auth.routes.js
│   ├── board.routes.js
│   ├── invite.routes.js
│   └── member.routes.js
├── scripts/
│   └── seed.js            # populates starter data
├── .env.example
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

## Test Accounts (Seeded Data)

| Email                | Password |
|-----------------------|----------|
| amila@example.com     | 123456   |
| maneth@example.com    | 123456   |

Alternatively, register a new account via `POST /api/auth/register` or the Register form on the frontend.

## Status

Working REST API backed by MongoDB. Real authentication (JWT) and real-time sync with Socket.io are planned for upcoming milestones.
