# Task Manager API

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` for your local PostgreSQL database.
2. Create a database named `taskmanager`.
3. Run the SQL in `db/schema.sql` against that database.
4. Run `npm install`, then `npm run dev`. Use `npm run build` to compile TypeScript for production.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service health check |
| GET | `/api/tasks` | List tasks, newest first |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update title, description, or completed state |
| DELETE | `/api/tasks/:id` | Delete a task |

Create a task with `{ "title": "Buy groceries", "description": "Milk and bread" }`. For updates, send only the fields that should change, such as `{ "completed": true }`.
