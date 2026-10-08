# FINORA API Reference

All private endpoints require the FINORA HTTP-only authentication cookie. The frontend API client automatically attempts `/api/auth/refresh` when an access token expires.

## Authentication

### POST `/api/auth/register`

```json
{"name":"Tanay","email":"tanay@example.com","password":"StrongPassword123"}
```

### POST `/api/auth/login`

```json
{"email":"demo@finora.app","password":"FinoraDemo@2026"}
```

### POST `/api/auth/logout`

Clears access and refresh cookies.

### POST `/api/auth/refresh`

Rotates a valid refresh session into a new access/refresh cookie pair.

### GET `/api/auth/me`

Returns the current authenticated user.

## Transactions

### GET `/api/transactions`

Query parameters:

- `search`
- `category`
- `type=INCOME|EXPENSE`
- `from`
- `to`
- `page`
- `limit`
- `sort=asc|desc`

### POST `/api/transactions`

```json
{
  "type":"EXPENSE",
  "description":"Food",
  "amount":450,
  "category":"Food",
  "date":"2026-10-08"
}
```

### PATCH `/api/transactions/:id`

Updates allowed transaction fields.

### DELETE `/api/transactions/:id`

Deletes the user's transaction and reverses its account balance effect.

## Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/cash-flow`
- `GET /api/dashboard/expense-breakdown`
- `GET /api/dashboard/net-worth`
- `GET /api/dashboard/insights`

## Budgets

- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/budgets/:id`
- `PATCH /api/budgets/:id`
- `DELETE /api/budgets/:id`

Budget responses include server-calculated `spent`, `remaining`, `percentageUsed`, and `status`.

## Goals

- `GET /api/goals`
- `POST /api/goals`
- `GET /api/goals/:id`
- `PATCH /api/goals/:id`
- `DELETE /api/goals/:id`

Goal responses include `percentageComplete` and `remainingAmount`.

## Market data

- `GET /api/market/stocks`
- `GET /api/market/stocks/:symbol`
- `GET /api/market/search?q=TCS`
- `GET /api/market/mutual-funds`
- `GET /api/market/etfs`
- `GET /api/market/gold`

These are demo data endpoints, not live financial feeds.

## Portfolio

- `GET /api/investments/holdings`
- `POST /api/investments/holdings`
- `GET/PATCH/DELETE /api/investments/holdings/:id`
- `GET /api/investments/portfolio`
- `GET /api/investments/portfolio/performance?period=1Y`
- `GET /api/investments/allocation`

Important portfolio values are calculated server-side from holdings and asset prices.

## Investment transactions

- `GET /api/investments/transactions`
- `POST /api/investments/transactions`
- `GET /api/investments/transactions/:id`

POST body:

```json
{
  "assetId":"asset-id",
  "type":"BUY",
  "quantity":5,
  "price":3750,
  "date":"2026-10-08"
}
```

Supported types:

- `BUY`
- `SELL`
- `SIP`
- `DIVIDEND`

A `SELL` cannot exceed the user's stored quantity. BUY/SELL/SIP holding changes are committed in a database transaction.

## Watchlist

- `GET /api/investments/watchlist`
- `POST /api/investments/watchlist`
- `DELETE /api/investments/watchlist/:assetId`

## SIP

- `GET /api/investments/sips`
- `POST /api/investments/sips`
- `PATCH /api/investments/sips/:id`
- `DELETE /api/investments/sips/:id`

## Dividends

- `GET /api/investments/dividends`
- `POST /api/investments/dividends`

## Analytics

- `GET /api/analytics/overview`
- `GET /api/analytics/cash-flow`
- `GET /api/analytics/expenses`
- `GET /api/analytics/savings`
- `GET /api/analytics/net-worth`
- `GET /api/analytics/investments`

## Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/:id/read`
- `DELETE /api/notifications/:id`

## Profile/settings

- `GET/PATCH /api/profile`
- `GET/PATCH /api/settings`
