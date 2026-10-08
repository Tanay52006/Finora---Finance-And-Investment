# FINORA — Full-Stack Personal Finance & Investment Platform

The frontend source of truth is the uploaded v0 FINORA UI: https://v0.app/tanaypatil2006-gmailcoms-projects/chat/finora-frontend-development-vpgD6vSfanu

This package keeps the existing FINORA Next.js UI and adds a persistent backend in the same Next.js application.

## Stack

- Next.js 16 + React 19 + TypeScript
- Next.js Route Handlers for `/api/*`
- PostgreSQL 17
- Prisma ORM
- JWT access + refresh cookies
- bcrypt password hashing
- Zod validation
- HTTP-only authentication cookies
- Docker Compose for local PostgreSQL

## What is connected

### Dashboard
- Persistent transactions
- Income/expense totals
- Balance and net-worth summary
- Transaction search/filter
- Add transaction
- Delete transaction
- Dashboard cash-flow/expense APIs

### Investments
- Server-backed stock discovery
- Mutual funds / ETFs / Gold market dataset
- Portfolio and holdings
- Server-side invested value, current value, P/L and return %
- Portfolio allocation
- Portfolio history chart data
- Persistent watchlist
- Add investment → investment transaction → holding update
- Buy / Sell / SIP investment transaction logic
- SIP records
- Dividend records
- Goals
- Notifications
- Analytics

### Security
- Passwords are bcrypt-hashed
- JWTs are stored in HTTP-only cookies
- Authenticated records are scoped by `userId`
- Financial totals are calculated from database records
- Zod request validation
- Authentication rate limiting
- Consistent JSON error responses
- `.env` is ignored from Git

## Run locally

### 1. Requirements

Install:

- Node.js 20+ (Node 22 recommended)
- Docker Desktop

### 2. Install dependencies

```bash
npm install
```

### 3. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 4. Create environment file

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

For local development the included values work with the Docker Compose database. Change JWT secrets before deploying anywhere public.

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Create database tables

For a fresh database:

```bash
npx prisma migrate dev --name init
```

### 7. Seed demo data

```bash
npm run db:seed
```

Demo account:

```text
Email:    demo@finora.app
Password: FinoraDemo@2026
```

The market and portfolio numbers in the demo account are explicitly simulated data.

### 8. Start FINORA

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

You can also create a new account at:

```text
http://localhost:3000/register
```

## Production build

```bash
npm run build
npm start
```

Set production values for:

```text
DATABASE_URL
JWT_SECRET
JWT_REFRESH_SECRET
NODE_ENV=production
FRONTEND_URL
```

Use a managed PostgreSQL database in production instead of the local Docker database.

## Useful Prisma commands

```bash
npx prisma studio
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

## Important demo-data note

FINORA currently uses a centralized database asset dataset rather than live market feeds. It intentionally does not claim the prices are live and does not execute trades.

To integrate live market data later, replace the `/api/market/*` data source with a licensed market-data provider. The frontend API contract can remain the same.

## Main API groups

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

GET/PATCH /api/profile
GET/PATCH /api/settings

GET/POST       /api/transactions
GET/PATCH/DELETE /api/transactions/:id

GET/POST       /api/budgets
GET/PATCH/DELETE /api/budgets/:id

GET/POST       /api/goals
GET/PATCH/DELETE /api/goals/:id

GET /api/dashboard/summary
GET /api/dashboard/cash-flow
GET /api/dashboard/expense-breakdown
GET /api/dashboard/net-worth
GET /api/dashboard/insights

GET /api/market/stocks
GET /api/market/stocks/:symbol
GET /api/market/search?q=
GET /api/market/mutual-funds
GET /api/market/etfs
GET /api/market/gold

GET/POST       /api/investments/holdings
GET/PATCH/DELETE /api/investments/holdings/:id
GET             /api/investments/portfolio
GET             /api/investments/portfolio/performance?period=1Y
GET             /api/investments/allocation

GET/POST        /api/investments/watchlist
DELETE          /api/investments/watchlist/:assetId

GET/POST        /api/investments/transactions
GET             /api/investments/transactions/:id

GET/POST        /api/investments/sips
PATCH/DELETE    /api/investments/sips/:id

GET/POST        /api/investments/dividends
GET             /api/investments/gold

GET/PATCH       /api/notifications
PATCH           /api/notifications/read-all
PATCH           /api/notifications/:id/read
DELETE          /api/notifications/:id

GET /api/analytics/overview
GET /api/analytics/cash-flow
GET /api/analytics/expenses
GET /api/analytics/savings
GET /api/analytics/net-worth
GET /api/analytics/investments
```

## Error format

```json
{
  "success": false,
  "message": "Transaction not found",
  "code": "TRANSACTION_NOT_FOUND"
}
```

Success:

```json
{
  "success": true,
  "data": {}
}
```

## Architecture

```text
FINORA Next.js UI
       |
       v
lib/api.ts
       |
       v
Next.js /api Route Handlers
       |
       v
Auth + Zod validation
       |
       v
Prisma
       |
       v
PostgreSQL
```

The frontend remains the visual source of truth; the backend powers its existing interactions and persistent data.
