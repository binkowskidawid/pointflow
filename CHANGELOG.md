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

### Fixed

- `packages/drizzle-schemas` build output: included `rootDir` and corrected `package.json` exports to support both ESM and CJS NestJS runtime requirements
- CockroachDB/Drizzle compatibility: switched from `drizzle-kit push` to file-based migrations via `postgres.js` to avoid `regtype[]` parsing errors during DB introspection
- `vitest` CI stability: added `--passWithNoTests` flag to prevent job failures in packages without test files
- `turbo.json`: `typecheck.dependsOn` changed from `^typecheck` to `^build` to ensure `dist/*.d.ts` files exist before cross-package TypeScript resolution
- `loyalty-engine` testing: added `vitest.config.ts` to exclude `dist/` folder, resolving CommonJS/ESM import conflicts during test runs

### Changed

- **Financial Precision**: Switched `visits.amount_spent` from `real` to `integer` (cents) to ensure 100% precision in financial calculations.
- `PointsCalculator`: Updated logic and unit tests to operate on cents (smallest currency unit).
- **Toolchain Upgrade**: Updated ESLint to v10, `typescript-eslint` to v8.56.1, and `turbo` to v2.8.14 across the workspace.
- **Security**: Moved from using `root` database user to a dedicated `pointflow_user` with restricted permissions.
- **Node.js Types**: Enforced `@types/node` at `^24.x` to strictly match the Node.js 24 LTS runtime strategy.

---

<!-- New releases are prepended above this line -->
