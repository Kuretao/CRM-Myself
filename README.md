# NOVA Ledger

Personal operating system for tasks, finance planning, reports, and move-to-Chengdu control.

PIN code: `120800`.

## Run

```bash
npm install
npm start
```

Open on iPhone with Expo Go by scanning the QR code. Web preview:

```bash
npm run web
```

## Backend

The production API lives in `server/` and uses PostgreSQL, Prisma migrations, JWT sessions,
rate limiting, and CORS. Start locally with `npm run api:dev`; full setup and API contract are
documented in [server/README.md](server/README.md). The client stays local-first until the
server URL is configured, then its storage adapter can move data through `GET /v1/workspace`.

For a VPS, create `.env` from `.env.production.example` and run:

```bash
docker compose --profile proxy up -d --build
```

This starts PostgreSQL privately, the API, and Caddy with automatic HTTPS for `NOVA_DOMAIN`.

## Brand

- Product name: `NOVA Ledger`
- Short name: `NOVA`
- Tagline: `Life, tasks & money control`
- Logo direction: compact circular NOVA mark, diagonal `N`, orbital point, Linear-like dark SaaS feel.

## Structure

- `App.tsx` - thin Expo entry point.
- `src/app` - app shell, state, navigation, storage wiring.
- `src/brand` - product identity constants.
- `src/pages` - screen-level pages.
- `src/components/brand` - brand/logo components.
- `src/components/ui` - reusable UI kit primitives.
- `src/components/layout` - app header, tab navigation, desktop sidebar.
- `src/features/finance` - finance-specific components.
- `src/features/reports` - analytics charts and report widgets.
- `src/features/tasks` - task-specific components.
- `src/features/chinese` - lessons, vocabulary, radicals, and writing practice.
- `src/features/documents` - personal document registry and local persistence.
- `src/theme` - color tokens and layout constants.
- `src/types` - shared domain types.
- `src/data` - seed data and planned payments.
- `src/storage` - AsyncStorage adapter.
- `src/utils` - formatters and calculations.

## Desktop Foundation

The app has two shells:

- mobile/tablet: compact header + horizontal tabs;
- desktop/web: permanent left sidebar + scrollable report workspace.

Navigation is centralized in `src/config/navigation.ts`, so new pages are added once and
become available in both shells.

Reports are intentionally separated from finance tables. Calculations live in `src/utils`,
while charts live in `src/features/reports/components`, so future work can add periods,
filters, export, and richer analytics without touching the core app shell.

## Chinese Workspace

The Chinese section ships with an offline starter course, RU/EN/ZH phrase lookup,
searchable vocabulary, a radical reference, saved words, lesson progress, and an
interactive `米字格` writing notebook. Course content is isolated in
`src/features/chinese/data/course.ts`; UI and domain types live beside it.

Translation currently performs exact offline lookup against the course database. Free-form
machine translation should be connected through a server-side translation provider so API
credentials are not exposed in the web or mobile client.

## Personal CRM

The Documents workspace tracks travel, study, housing, health, and finance paperwork.
Records are stored locally and include readiness, expiration date, responsible contact,
storage location, and notes. The shared date picker supports real month navigation and is
used by documents, tasks, and planning.
