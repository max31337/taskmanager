# Task Manager

A small full-stack task manager built with React, TypeScript, Express, and PostgreSQL. It supports creating, editing, completing, searching, filtering, and deleting tasks.

## Project structure

```
taskmanager/
├── backend/     Express + TypeScript API and PostgreSQL schema
└── frontend/    React + TypeScript application
```

## Requirements

- Node.js 20 or later
- npm
- PostgreSQL 14 or later

## Setup

### 1. Create the database

Create a PostgreSQL database named `taskmanager`:

```sql
CREATE DATABASE taskmanager;
```

Run the schema file against it. From the project root, this can be done with:

```bash
psql -U postgres -d taskmanager -f backend/db/schema.sql
```

### 2. Configure the backend

Copy the example environment file:

```bash
copy backend\.env.example backend\.env
```

Update `backend/.env` with your PostgreSQL username, password, host, port, and database name. For example:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/taskmanager
```

If your password contains characters such as `@`, `:`, `/`, or `#`, URL-encode it in the connection string.

### 3. Install dependencies

Install each application's dependencies:

```bash
cd backend
npm install
cd ..\frontend
npm install
```

## Run the application

Open two terminals from the project root.

In the first terminal, start the backend API:

```bash
cd backend
npm run dev
```

The API runs at `http://localhost:3001`.

In the second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Vite will show the local address for the app, usually `http://localhost:5173`.

The frontend uses `http://localhost:3001/api` by default. To use a different API address, create `frontend/.env` and set:

```env
VITE_API_URL=http://localhost:3001/api
```

## Available scripts

| Location | Command | Purpose |
| --- | --- | --- |
| `backend` | `npm run dev` | Run the TypeScript API with file watching |
| `backend` | `npm run build` | Compile the API to `backend/dist` |
| `backend` | `npm start` | Run the compiled API |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run lint` | Check frontend code quality |
| `frontend` | `npm run build` | Type-check and build the frontend for production |

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is available |
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update a task's title, description, or completion state |
| `DELETE` | `/api/tasks/:id` | Delete a task and return `204 No Content` |

## Dependencies

The frontend uses React, React DOM, Vite, TypeScript, and ESLint. The backend uses Express, PostgreSQL's `pg` driver, CORS, dotenv, TypeScript, and tsx. The backend uses direct parameterized SQL queries; no ORM is used.
