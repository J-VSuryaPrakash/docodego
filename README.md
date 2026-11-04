# Shared Bill Splitter

A full-stack bill-splitting application for shared homes. It lets users create a home, add members, create bills, divide each bill between the members, and track individual payments and outstanding balances.

All money is stored as whole cents. A bill is split so that its shares always add up to the original total, including amounts that do not divide evenly.

## Features

- Create and list shared homes.
- Add members to a home.
- View each member's outstanding balance.
- Create bills and split them between every member of the home.
- Distribute extra cents in member creation order.
- View the individual shares for a bill.
- Mark a share as paid through a confirmation modal.
- Retry uncertain payment requests safely with the same idempotency key.
- Prevent duplicate and concurrent payments.
- Validate requests on both the frontend and backend with shared Zod schemas.

## Tech stack

### Web

- React 19
- TypeScript
- Vite
- TanStack Router
- Tailwind CSS
- React Hook Form
- Zod
- Axios

### API

- Hono
- Cloudflare Workers
- Cloudflare D1
- TypeScript
- Zod Validator

### Tooling

- pnpm workspaces
- Vitest with the Cloudflare Workers test runtime
- Biome for formatting and linting

## Project structure

```text
.
├── api/
│   ├── migrations/       # D1 schema migrations
│   ├── src/routes/       # Hono route handlers
│   ├── src/services/     # Database and business logic
│   └── test/             # API integration tests
├── packages/shared/
│   └── src/schemas/      # Shared Zod schemas and inferred types
├── web/
│   └── src/
│       ├── api/          # Axios client and API functions
│       ├── components/   # Reusable cards and payment modal
│       ├── pages/        # Home, member, bill, and share pages
│       └── routes/       # TanStack file routes
└── package.json          # Workspace commands
```

## How the application works

The home page creates and lists homes. Each home links to its members and bills. Adding a bill creates one share for every member currently in that home.

The API calculates a base share using integer division. Any remaining cents are assigned one at a time in the order the members were created. For example, a 1,000-cent bill shared by three members becomes `334`, `333`, and `333`.

When a user pays a share, the frontend creates an idempotency key and keeps it in a ref for that share. If the request fails or its response is lost, retrying uses the same key. The API conditionally updates only an unpaid share and stores the key with the payment. A repeated request with the same key returns the existing result, while a different key for an already paid share returns `409 Conflict`.

## Local setup

### Requirements

- Node.js
- pnpm

Install the workspace dependencies from the repository root:

```bash
pnpm install
```

The web application reads its API URL from `web/.env`:

```env
VITE_BASE_URL=http://localhost:8787/api
```

Start the API and web application together:

```bash
pnpm dev
```

This command applies the D1 migrations to the local database before starting the API.

- Web: `http://localhost:5173`
- API: `http://localhost:8787`

If pnpm reports that build scripts were ignored, run the following command and allow `esbuild` and `workerd`:

```bash
pnpm approve-builds
```

## Environment configuration

The Cloudflare Worker uses the `DB` D1 binding configured in `api/wrangler.jsonc`.

Local Vite requests from `http://localhost:5173` and `http://127.0.0.1:5173` are allowed by default. A deployed frontend origin can be supplied through the optional `CORS_ORIGIN` Worker binding. Multiple origins can be separated with commas.

```text
CORS_ORIGIN=https://example.com,https://www.example.com
```

After changing `api/wrangler.jsonc`, regenerate the Worker environment types:

```bash
pnpm --filter bill-splitter-api cf-typegen
```

## API endpoints

All endpoints use the `/api` prefix. Error responses use the following shape:

```json
{
  "error": "Error message"
}
```

| Method | Endpoint                                  | Description                |
| ------ | ----------------------------------------- | -------------------------- |
| `GET`  | `/api/homes`                              | List all homes             |
| `POST` | `/api/homes`                              | Create a home              |
| `POST` | `/api/homes/:homeId/members`              | Add a member to a home     |
| `GET`  | `/api/homes/:homeId/balances`             | List member balances       |
| `GET`  | `/api/homes/:homeId/bills`                | List bills for a home      |
| `POST` | `/api/homes/:homeId/bills`                | Create and split a bill    |
| `GET`  | `/api/homes/:homeId/bills/:billId/shares` | List the shares for a bill |
| `POST` | `/api/bills/:billId/shares/:shareId/pay`  | Pay one share              |

The payment endpoint requires an `Idempotency-Key` request header.

## Commands

```bash
pnpm dev          # start the API and web app
pnpm test         # run API tests
pnpm typecheck    # run TypeScript checks in every workspace
pnpm check        # run Biome formatting and lint checks
pnpm check:fix    # apply safe Biome fixes
pnpm build        # create the production web build
```

## Decisions

### 1. Share validation and types between the API and web app

I created a separate shared package for the Zod schemas and TypeScript types used by both the frontend and backend. This keeps the request shapes and validation rules in one place instead of maintaining two versions of the same definitions.

I chose this approach because duplicated schemas can slowly become inconsistent as the application changes. Sharing them gives both sides the same contract and makes future changes easier to apply safely. The API uses the schemas to validate incoming data, and the web forms use them for client-side validation. There is still room to make the frontend's API error messages more specific.

### 2. Keep related database writes atomic

I use Cloudflare D1's `db.batch()` when creating a bill and its shares so those related writes are handled together. For payments, I use a conditional SQL update that only sets `paid_at` when the share is currently unpaid.

This prevents a partially created bill if one of the share inserts fails. The conditional payment update also protects against concurrent requests: once one request changes the share from unpaid to paid, another request cannot perform the same transition.

### 3. Store idempotency keys with payment records

I implemented payment idempotency with a column in D1 instead of adding Redis or another external service. The frontend generates a unique key for each payment attempt, sends it in the `Idempotency-Key` header, and reuses that key when retrying an uncertain request. The API stores the key when the payment succeeds.

I made this choice because the project has a small and focused payment flow, so keeping the key beside the share is simpler to operate and explain. If the API processes a payment but its response is lost, a retry with the same key returns the existing result. A request using a different key for an already paid share receives a conflict response, which prevents duplicate payments.

## Data integrity

The database schema uses foreign keys, checks, and uniqueness constraints to protect relationships between homes, members, bills, and shares. The main safeguards are:

- Members must belong to an existing home.
- Bills must belong to an existing home.
- Shares must reference an existing bill and member.
- Bill and share amounts cannot be negative.
- A member can have only one share for a given bill.
- Payment updates only succeed while a share is unpaid.

## Testing

The API tests cover home and member creation, even and uneven bill splitting, invalid amounts, homes without members, balances, missing resources, repeated payments, and conflicting idempotency keys.

Run them with:

```bash
pnpm test
```
