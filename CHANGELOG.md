# Changelog

All notable changes to PointFlow are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
PointFlow adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Monorepo foundation with Turborepo 2.8.12 and pnpm 10.x
- Shared TypeScript configurations: `base`, `nextjs`, `nestjs`
- Shared ESLint configuration (`@pointflow/eslint-config`)
- Project structure: `apps/`, `services/`, `packages/`, `infrastructure/`
- `@pointflow/contracts` — shared TypeScript contracts package for inter-service DTOs and Kafka event types (`PointsEarnedEvent`, `CreateVisitDto`, `CardTier`, `Currency`)
- `@pointflow/types` — pure domain models (`Visit` with `PromotionSnapshot` SettingSnapshot pattern, `LoyaltyCard`)
- `services/api-gateway` — Central entry point for all frontend requests, translating HTTP/REST to internal TCP/RPC.
- `apps/web` — Updated to use central `apiClient` and `API_ROUTES` for better maintainability.
- `@pointflow/drizzle-schemas` — Drizzle ORM schemas for `visits` and `loyalty_cards` tables with typed JSONB column
- Initial database migration `0000_icy_bedlam.sql` for CockroachDB v25.2
- `infrastructure/docker-compose.yml` — CockroachDB v25.2.13 single-node dev setup with health check and persistent volume
- Code quality toolchain: Prettier 3.x, Husky 9.x pre-commit hooks, lint-staged
- GitHub Actions CI pipeline (`quality` + `build` jobs, Node 24, pnpm 10)
- GitHub branch-protection rules: required CI check, required code review, auto-delete on merge
- `services/loyalty-engine` — NestJS 11.1.16 HTTP service with `VisitsModule` (full request-to-persistence flow)
- `PointsCalculator` — domain logic service with comprehensive unit tests (vitest)
- `DatabaseModule` — Drizzle ORM integration using `postgres.js` driver for optimized CockroachDB performance
- `nestjs-pino` integration — enterprise-grade JSON logging with `pino-pretty` development support and conditional sensitive data (body) logging
- Custom migration runner (`packages/drizzle-schemas/src/migrate.ts`) to handle CockroachDB's specific DDL and introspection behaviors
- Monorepo root aliases for `db:generate` and `db:migrate` (pnpm filter shortcuts)
- Professional Design System with emerald-accented dark theme using Tailwind CSS 4.0 tokens
- Hand-crafted UI component library (Button, Card, Badge, Input, Label, Separator, Skeleton, Table, Toaster)
- Responsive Dashboard Layout with persistent Sidebar (desktop) and Hamburger Drawer (mobile)
- Automated Navigation with active state detection via `usePathname`
- `CheckCardView` implementation using `@tanstack/react-query` for asynchronous visit history fetching
- `RegisterVisitView` with `useMutation` and intelligent cache invalidation (Syncs visit history instantly)
- Centrally managed Constants for navigation (`navItems.tsx`, `bottomItems.tsx`)
- Centralized `loyaltyEngineClient` (Axios) with response interceptors for standardized error logging
- Enabled CORS in NestJS `loyalty-engine` for local development (port 3000 -> 3001)
- Local Docker Compose infrastructure: Apache Kafka 4.2 in KRaft mode, Kafka UI, and MailHog.
- Dictionary for Kafka topics (`topics.ts`) and completely revised typed event structures (`PointsAwardedEvent`, `TierChangedEvent`) within `@pointflow/contracts`.
- API Gateway microservice skeleton (`@pointflow/api-gateway` in NestJS 11) acting as the single HTTP entry point on port 3001.
- **Advanced Card Resolution**: Introduced `resolveCard` in `loyalty-engine` to identify cards by UUID, code, phone, or email.
- **Phone Normalization**: Implemented 9-digit suffix matching for phone numbers in `CardsRepository`.
- **New `@pointflow/utils` package**: Dedicated package for shared business utilities like `generateLoyaltyCardCode`.
- **Modular Cards Logic**: Refactored `loyalty-engine` to have a standalone `CardsModule`.
- **Tenant-Aware Queries**: Updated API Gateway and Frontend to ensure `tenantId` is consistently passed for secure data isolation.
- **Notifications Service**: Scaffolded and implemented a new NestJS Kafka consumer service (`notifications`) responsible for handling email dispatches.
- **MailHog Integration**: Wired up the `notifications` to use `nodemailer` for sending Welcome Emails locally via MailHog.
- **Hybrid Microservice**: Transformed the `loyalty-engine` into a Hybrid app capable of processing both synchronous TCP commands (via API Gateway) and asynchronous Kafka events (e.g. `USER_CREATED`).
- **Data Simulator**: Introduced `scripts/simulate-user-created.ts` to mock Kafka events coming from Auth Service without actually deploying Auth Service yet.
- **Materialized Views**: Added a Read Model via `UsersRepository` in `loyalty-engine` reacting to the `USER_CREATED` topic, synchronizing essential user info for internal processes.
- **Point Accumulation System**: Integrated dynamic point calculation upon visits in `loyalty-engine` emitting explicit `PointsAwardedEvent` messages to Kafka.
- **Dashboard Visibility**: Exposed `cardCode` on visit records within the `app/(dashboard)` views of the `web` frontend app.
- **Auth Service**: Implemented the core Identity Provider service (`auth`) in NestJS 11 with hybrid TCP/Kafka communication.
- **Identity Schema**: Updated `users` table with `passwordHash`, `role`, and `tenantId` (Multi-tenant scoped unique email).
- **DTO Validation**: Converted all shared contracts (`CreateUserDto`, `CreateVisitDto`, `CreateLoyaltyCardDto`) to classes with `class-validator` decorators.
- **Secure Password Hashing**: Integrated `bcrypt` in `AuthService` for one-way password encryption before persistence.
- **Gateway Auth Integration**: Connected `api-gateway` to `auth` service via TCP and exposed `/api/v1/auth/register` and `/api/v1/auth/ping` endpoints.
- **Frontend Auth Client**: Added `authApi` and `API_ROUTES.AUTH` constants to `apps/web` for frontend-to-backend authentication flow.
- **Global DB Scripts**: Updated `db-migrate-all` and `db-seed-all` to include the new `pf_auth` database.
- **Notifications Data Isolation**: Implemented a standalone user repository within `notifications` reacting to `USER_CREATED` to hold contact profiles securely for email dispatches.
- **JWT Login Flow**: Implemented complete `/auth/login` endpoint in `auth` service — validates credentials with `bcrypt`, issues short-lived access token (15m) and long-lived refresh token (7d) signed with separate secrets (`JWT_SECRET` / `JWT_REFRESH_SECRET`).
- **Redis Token Repository**: `TokenRepository` in `auth` service stores refresh tokens as `refresh_token:{userId}:{sha256(token)}` with 7-day TTL. Supports token existence check, rotation, and explicit revocation on logout.
- **Token Rotation**: On each `POST /auth/refresh`, the old refresh token is deleted from Redis and a new pair issued — prevents replay attacks.
- **HttpOnly Refresh Cookie**: Refresh token delivered exclusively via `Set-Cookie` with `HttpOnly`, `SameSite: lax`, `Path: /api/v1/auth`. `Secure` flag enabled in production. Never accessible from JavaScript.
- **`LoginDto`**: New shared contract in `@pointflow/contracts` with `class-validator` decorators for `tenantId`, `email`, `password` fields.
- **JwtStrategy**: Passport JWT strategy in `api-gateway` validates `Authorization: Bearer` header and extracts `{id, email, tenantId, role, name}` into `req.user` for downstream use.
- **Global JwtAuthGuard**: All `api-gateway` routes protected by default via `APP_GUARD` DI token — deny-by-default security model.
- **`@Public()` decorator**: `SetMetadata`-based decorator for explicit opt-out from JWT guard on public endpoints (`login`, `register`, `refresh`, `logout`, `ping`).
- **Frontend Session Management** (`apps/web/src/lib/auth/session.ts`): In-memory access token store using module-level variable + `useSyncExternalStore`. Includes `bootstrapSession()` for silent session restore on app start and deduplication of concurrent refresh calls via shared `Promise`.
- **Axios Interceptor with 401 Retry**: Request interceptor attaches `Authorization: Bearer` from in-memory token. Response interceptor transparently retries failed requests after silent token refresh on 401.
- **Login Page** (`apps/web/src/app/(auth)/login/page.tsx`): Full login form with `tenantId`, `email`, `password`. On success: `setSession(accessToken)` + `router.replace('/')`.
- **AuthGate component**: Client component that reads auth state and redirects unauthenticated users to `/login`. Used in `(dashboard)/layout.tsx` to protect all dashboard routes.
- **AuthBootstrapper component**: Fires `bootstrapSession()` on app mount — restores JWT session from HttpOnly cookie without user interaction.

### Fixed

- **DTO Validation Support**: Enabled `experimentalDecorators` and `emitDecoratorMetadata` in `packages/contracts/tsconfig.json` to support `class-validator` in the shared package.
- **UUID Parsing Errors**: Resolved `RpcExceptionsHandler` errors where identifiers (phone/code) were incorrectly treated as UUIDs by the database.
- **Frontend Loading State**: Resolved `UND_ERR_HEADERS_TIMEOUT` by correcting API URLs and mapping to the new API Gateway port.
- **Frontend Loading State**: Resolved `UND_ERR_HEADERS_TIMEOUT` by correcting API URLs and mapping to the new API Gateway port.
- **Microservices Routing**: Fixed 404 errors by properly registering controllers in the Gateway's `LoyaltyModule`.
- **Logger Wildcards**: Updated `nestjs-pino` configuration to support Express 5.0 route path syntax.
- **Kafka Topic Syntax Issues**: Addressed `INVALID_TOPIC_EXCEPTION` by updating string message patterns in `@pointflow/contracts` to avoid colons (`:`) resulting in safe "dot" notations (e.g. `loyalty.visit.create`).
- **Conflict of Kafka ClientIDs**: Established distinct Kafka Client IDs per server connection by separating standard `-client` and `-server` suffixes defined in environment configuration to avoid internal connection resets.
- **Unique Constraint Restarts (Poison Pills)**: Demonstrated KafkaJS robust error recovery — correctly processing automatic retries and delaying restarts upon catching Drizzle DB `UNIQUE KEY` exceptions, instead of silently dropping data.
- `packages/drizzle-schemas` build output: included `rootDir` and corrected `package.json` exports to support both ESM and CJS NestJS runtime requirements
- CockroachDB/Drizzle compatibility: switched from `drizzle-kit push` to file-based migrations via `postgres.js` to avoid `regtype[]` parsing errors during DB introspection
- `vitest` CI stability: added `--passWithNoTests` flag to prevent job failures in packages without test files
- `turbo.json`: `typecheck.dependsOn` changed from `^typecheck` to `^build` to ensure `dist/*.d.ts` files exist before cross-package TypeScript resolution
- `loyalty-engine` testing: added `vitest.config.ts` to exclude `dist/` folder, resolving CommonJS/ESM import conflicts during test runs

### Changed

- **Microservice Communication**: Switched `loyalty-engine` from HTTP to TCP (Transport.TCP).
- **Frontend API Architecture**: Introduced `apiClient` (Axios) and `serverFetch` (Next.js Server Component helper) with centralized `API_ROUTES`.
- **Financial Precision**: Switched `visits.amount_spent` from `real` to `integer` (cents) to ensure 100% precision in financial calculations.
- `PointsCalculator`: Updated logic and unit tests to operate on cents (smallest currency unit).
- **Toolchain Upgrade**: Updated ESLint to v10, `typescript-eslint` to v8.56.1, and `turbo` to v2.8.14 across the workspace.
- **Security**: Moved from using `root` database user to a dedicated `pointflow_user` with restricted permissions.
- **Node.js Types**: Enforced `@types/node` at `^24.x` to strictly match the Node.js 24 LTS runtime strategy.

---

<!-- New releases are prepended above this line -->
