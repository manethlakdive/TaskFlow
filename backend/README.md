# SyncBoard Backend

Express REST API with in-memory mock data (no real database) that serves the
SyncBoard / TaskFlow frontend.

## Run locally

```bash
cd syncboard-backend
npm install
npm run dev
```

Server starts at **http://localhost:5000**

## Endpoints

| Method | Endpoint                          | Description                         |
|--------|------------------------------------|--------------------------------------|
| POST   | `/api/auth/login`                 | Login with email + password          |
| POST   | `/api/auth/register`              | Register a new user                  |
| GET    | `/api/boards`                     | Get all columns + tasks              |
| POST   | `/api/boards/tasks`               | Create a task in a column            |
| PATCH  | `/api/boards/tasks/:taskId/move`  | Move a task to another column        |
| GET    | `/api/members`                    | Get team members list                |
| POST   | `/api/invites`                    | Invite a new team member             |

## Test users (mock data)

| Email               | Password |
|---------------------|----------|
| amila@example.com   | 123456   |
| maneth@example.com  | 123456   |

Or just register a new account via `/api/auth/register` / the Register form.
