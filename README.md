# MERN Event Booking System

A work-in-progress event booking system. The current backend is an Express API backed by MongoDB, with JWT authentication, user/admin roles, and event listing and management. Booking and seat-reservation features are not implemented yet.

## Features (current status)

### Done

- Express server with a MongoDB connection through Mongoose.
- JWT authentication: register and log in.
- Role-based access with `user` and `admin` roles.
- Events API with pagination, text search, and an exact-date filter.
- Request and query validation with clear client error responses.
- Centralized handling for server errors and Mongoose validation errors.

### Coming soon

- React frontend.
- Calendar view.
- Seat selection with double-booking protection.
- Booking flow.
- Email confirmations with Nodemailer.

## Tech stack

Packages currently listed in [`server/package.json`](server/package.json):

- Node.js (20 or later), Express, Mongoose, MongoDB.
- `bcryptjs`, `jsonwebtoken`, `zod`, `dotenv`, and `cors`.

## Folder structure

```text
server/
├── .env.example                 # Environment variable template
├── package.json                 # Server scripts and dependencies
└── src/
    ├── app.js                   # Express app, middleware, and API mounts
    ├── server.js                # Environment checks, MongoDB connection, and startup
    ├── controllers/             # Authentication and event request handlers
    ├── middleware/              # Authentication, role checks, validation, and errors
    ├── models/                  # Mongoose User and Event models
    ├── routes/                  # Health, authentication, and event endpoints
    ├── utils/                   # JWT helpers
    └── validators/              # Zod schemas for authentication and events
```

## Getting started

### Prerequisites

- Node.js 20 or later and npm.
- MongoDB Atlas or a MongoDB server running locally.

### Install and configure

```powershell
git clone https://github.com/Anamikakathait12/Event-booking-system.git
Set-Location Event-booking-system\server
npm install
Copy-Item .env.example .env
```

Edit `server/.env` with your local settings. Do not commit this file.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string for Atlas or a local database. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs; must be at least 32 bytes. |
| `PORT` | No | HTTP port; defaults to `5000`. |
| `CLIENT_URL` | No | Allowed CORS origin; defaults to `http://localhost:5173`. |
| `JWT_EXPIRES_IN` | No | JWT lifetime; defaults to `1d`. |

### Run the server

From the `server` directory:

```powershell
npm run dev
```

The API listens on the configured port (default `5000`). Use `npm start` to run without Node's watch mode. Check `GET /api/health` for a health response.

## API documentation

All request and response bodies use JSON. Unless otherwise noted, errors use `{ "error": "..." }`; validation errors also include a `details` array. Event IDs are MongoDB ObjectIds.

| Method | URL | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | API health status and timestamp. |
| `POST` | `/api/auth/register` | Public | Create a user account and return a JWT. New accounts have the `user` role. |
| `POST` | `/api/auth/login` | Public | Authenticate and return a JWT and user. |
| `GET` | `/api/auth/me` | User/admin | Return the authenticated user's public profile. |
| `GET` | `/api/auth/admin` | Admin | Verify administrator access. |
| `GET` | `/api/events` | Public | List events, optionally filtered and paginated. |
| `GET` | `/api/events/:id` | Public | Return one event. |
| `POST` | `/api/events` | Admin | Create an event; `createdBy` is set from the authenticated admin. |
| `PUT` | `/api/events/:id` | Admin | Update one or more supplied event fields. |
| `DELETE` | `/api/events/:id` | Admin | Delete an event; returns `204` with no body. |

### Register

`POST /api/auth/register`

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "a-strong-password"
}
```

Success (`201`):

```json
{
  "user": {
    "id": "66a000000000000000000001",
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "role": "user"
  },
  "token": "<jwt>"
}
```

### Login

`POST /api/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "a-strong-password"
}
```

Success (`200`) returns the same `{ "user": ..., "token": ... }` shape as registration. Invalid credentials return `401`.

### Create an event

`POST /api/events` requires an admin bearer token. `date` uses `YYYY-MM-DD`; `time` uses 24-hour `HH:mm`. The total seat count must not exceed `rows × columns`.

```json
{
  "title": "Summer Music Night",
  "description": "An evening of live music.",
  "date": "2027-06-15",
  "time": "19:30",
  "venue": "Riverside Hall",
  "category": "Music",
  "imageUrl": "https://example.com/event-image.jpg",
  "price": 25,
  "totalSeats": 100,
  "seatLayout": {
    "rows": 10,
    "columns": 10
  }
}
```

Success (`201`) returns `{ "event": { ... } }`, including the supplied fields, generated `_id`, admin `createdBy` ID, and `createdAt`/`updatedAt` timestamps. Do not include `createdBy` in the request.

### List events

`GET /api/events` accepts these query parameters:

| Parameter | Description |
| --- | --- |
| `page` | Positive page number; defaults to `1`. |
| `limit` | Positive number of events per page; defaults to `20`, maximum `100`. |
| `search` | Optional text (up to 100 characters); case-insensitive match in title, description, venue, or category. |
| `date` | Optional exact calendar date in `YYYY-MM-DD` format; returns events on that UTC date. |

For example: `GET /api/events?page=2&limit=10&search=music&date=2027-06-15`. The response contains an `events` array and `pagination` metadata (`page`, `limit`, `total`, and `totalPages`). Invalid query parameters return `400`.

### Authentication and access

Send the JWT in the `Authorization` header for protected requests:

```http
Authorization: Bearer <token>
```

Registration always creates a `user`. To grant administrator access, update that user's `role` field to `admin` in the trusted MongoDB database. The API does not provide a public role-promotion endpoint. Missing or invalid tokens return `401`; a non-admin accessing an admin-only route receives `403`.

## Roadmap

- [ ] Build the React frontend.
- [ ] Add a calendar view.
- [ ] Implement seat selection.
- [ ] Prevent double-booking seats.
- [ ] Build the booking flow.
- [ ] Send email confirmations with Nodemailer.
- [ ] Deploy the application.
