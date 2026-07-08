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
