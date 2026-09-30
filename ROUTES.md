# Nextjs-v13-Green-29093 — Routes & Navigation

## How to run
cd /workspace/frontend_runs/2d9b4f07-1881-4ad3-bcbe-690c05d8ad55/project
npm install --legacy-peer-deps && npx next dev -p 46615
Then open http://localhost:46615

## Routes

| Route | Page file | Description |
|-------|-----------|-------------|
| / | app/page.tsx | Redirects to /dashboard |
| /login | app/login/page.tsx | Sign in / sign up (toggle) with mock accounts, forgot-password mock flow |
| /dashboard | app/(shell)/dashboard/page.tsx | Financial overview: totals, category breakdown, recent transactions |
| /transactions | app/(shell)/transactions/page.tsx | Full transaction list with search, filter, sort, edit, delete |
| /transactions/add | app/(shell)/transactions/add/page.tsx | Form to create a new transaction |
| /transactions/[id]/edit | app/(shell)/transactions/[id]/edit/page.tsx | Form to edit an existing transaction |
| /categories | app/(shell)/categories/page.tsx | View predefined categories, create/delete custom categories |
| /monthly-summary | app/(shell)/monthly-summary/page.tsx | Select a month and view income/expenses/balance/category breakdown |
| (any unmatched URL) | app/not-found.tsx | 404 page with a Go Home link |

## Navigation map
- /login -> /dashboard (successful sign in / sign up)
- Any (shell) route -> /login (no active mock session; AuthGuard redirects)
- (shell) TopBar "Log out" button -> /login
- Sidebar (Dashboard, Transactions, Categories, Monthly Summary) -> respective page (all screens)
- Mobile bottom nav -> same four routes on small screens
- TopBar "Add Transaction" button -> /transactions/add (all screens)
- Dashboard -> Transactions ("View All Transactions" link)
- Dashboard -> Transactions/Add (empty-state "Add Transaction" action, when there are no transactions)
- Transactions -> Transactions/Add ("Add Transaction" button / TopBar button)
- Transactions -> Transactions/[id]/Edit (row/card "Edit" button)
- Transactions -> Delete confirmation dialog (row/card "Delete" button) -> confirms and stays on Transactions, refreshed
- Transactions/Add -> Transactions (Cancel button or successful submit)
- Transactions/[id]/Edit -> Transactions (Cancel button or successful submit)
- Categories -> Delete confirmation dialog (custom category "Delete" button) -> confirms and stays on Categories, refreshed
- TransactionForm (inside Add/Edit) -> Categories ("Manage categories" link)
- Any page -> NotFound (unknown URL) -> Dashboard ("Go Home" link)

## Shared components
- components/Sidebar.tsx — desktop sidebar navigation with active-route highlighting
- components/TopBar.tsx — top header showing the current page title and an "Add Transaction" shortcut
- components/MobileNav.tsx — bottom navigation bar shown on small screens
- components/SummaryCards.tsx — total income / expenses / balance / count cards, used on Dashboard and Monthly Summary
- components/CategoryBreakdown.tsx — donut chart + legend of spending by category, used on Dashboard and Monthly Summary
- components/TransactionForm.tsx — shared controlled form for creating and editing transactions, with validation
- components/EmptyState.tsx — empty-state placeholder with optional call-to-action button
- components/ConfirmDialog.tsx — reusable confirmation modal for destructive actions (delete transaction / delete category)
- components/LoadingSpinner.tsx — loading indicator shown while data is being fetched from the store

## Design tokens
- primary: #2563eb
- primary-dark: #1d4ed8
- success: #10b981
- danger: #ef4444
- warning: #f59e0b
- income: #10b981
- expense: #ef4444
- surface: #f9fafb
- card: #f3f4f6
- border: #e5e7eb
- text-secondary: #4b5563
- text-primary: #111827

## Notes
- All data (transactions, categories, users, and the current session) is persisted to localStorage via lib/stores/, seeded once from lib/mock-data.ts.
- Auth is a mock, localStorage-backed flow (lib/stores/auth-store.ts). Demo login: demo@example.com / password123. The (shell) route group is gated by components/AuthGuard.tsx, which redirects to /login when there is no active session.
- Predefined categories (Food, Travel, Shopping, Bills, Health, Entertainment, Other) cannot be deleted.
- Custom categories can only be deleted when no transaction references them.
- The Vitest smoke test suite (npm run test) passes for all seven testable page components.
