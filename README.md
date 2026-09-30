# Nextjs-v13-Green-29093

A Personal Expense Tracker web application for managing daily income and
expenses. It includes a dashboard overview, full transaction management
(create, search, filter, sort, edit, delete), predefined and custom
category management, and a monthly summary view with category breakdowns.
All data is persisted locally in the browser so it survives page refreshes.

## Tech stack
Next.js (App Router) + TypeScript, Tailwind CSS v3.

## Getting started
```
npm install --legacy-peer-deps
cp .env.example .env
npm run dev
```
Then open http://localhost:46615

## Environment variables
See .env.example. NEXT_PUBLIC_API_URL is optional — every entity runs on
local mock data (USE_MOCK = true in lib/stores/) until it's set and each
entity's flag is flipped to false.

## Project structure
- app/ — App Router pages and layouts (dashboard, transactions, categories, monthly-summary)
- components/ — shared UI components (Sidebar, TopBar, forms, cards, dialogs)
- lib/ — mock data, localStorage-backed stores, constants, validation, and utility helpers
- types/ — shared TypeScript types for Transaction and Category entities

## Testing
```
npm run test
```
Runs the Vitest smoke test suite covering every page component.
