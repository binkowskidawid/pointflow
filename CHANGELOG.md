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
- `@pointflow/contracts` — shared TypeScript contracts package for inter-service DTOs and Kafka event types
- Code quality toolchain: Prettier 3.x, Husky 9.x pre-commit hooks, lint-staged
- GitHub Actions CI pipeline (`quality` + `build` jobs, Node 24, pnpm 10)
- GitHub branch-protection rules: required CI check, required code review, auto-delete on merge

---

<!-- New releases are prepended above this line -->
