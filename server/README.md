# NOVA Ledger API

Fastify API with PostgreSQL and Prisma. The Expo client remains independent until the
sync adapter is switched from local storage to these endpoints.

## Local run

1. Copy `.env.example` to `.env` and replace `JWT_SECRET` with a random string of at least 32 characters.
2. Start PostgreSQL from the repository root: `docker compose up -d postgres`.
3. Install and generate the client: `npm install && npm run prisma:generate`.
4. Apply the tracked migration: `npm run prisma:deploy`.
5. Start the API: `npm run dev`.

`GET http://localhost:4000/health` confirms API and database availability.

## API contract

All `/v1/*` routes except `/v1/auth/register`, `/v1/auth/login`, and `/v1/auth/refresh`
require `Authorization: Bearer <accessToken>`.

| Domain                 | Endpoint               |
| ---------------------- | ---------------------- |
| Auth and profile       | `/v1/auth/*`           |
| Initial client sync    | `GET /v1/workspace`    |
| Tasks                  | `/v1/tasks`            |
| Accounts               | `/v1/accounts`         |
| Categories             | `/v1/categories`       |
| Transactions           | `/v1/transactions`     |
| Planned payments       | `/v1/plannedItems`     |
| Documents              | `/v1/documents`        |
| Chinese progress       | `/v1/chinese/progress` |
| NOVA AI thread storage | `/v1/ai/threads`       |

The access token is short-lived. Store the refresh token only in encrypted device storage
on iOS/Android, rotate it through `/v1/auth/refresh`, and never expose `JWT_SECRET` to the client.

## Production

At deployment time create a root `.env` with `POSTGRES_PASSWORD`, `JWT_SECRET`, and the
public web origins in `CORS_ORIGINS`, then run `docker compose up -d --build`.
Put an HTTPS reverse proxy such as Caddy or Nginx in front of port `4000`; do not expose
PostgreSQL outside Docker.
