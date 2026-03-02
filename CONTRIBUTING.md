# Contributing to PointFlow

Thank you for your interest in contributing! This document covers everything you need to get started.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Search [existing issues](https://github.com/binkowskidawid/pointflow/issues) first — your bug may already be reported.
2. Open a new issue using the **Bug Report** template.
3. Include: OS, Node.js version, Docker version, and exact error output.

### Suggesting Features

1. Open a new issue using the **Feature Request** template.
2. Explain the problem you are solving, not just the solution.
3. Note which stage of the roadmap this fits (Stage 1–4).

### Submitting a Pull Request

1. **Fork** the repository and create a branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the dev stack:**

   ```bash
   docker compose -f infrastructure/docker-compose.yml up -d
   pnpm run dev
   ```

4. **Make your changes.** Follow the code standards below.

5. **Run checks before pushing** (mirrors CI exactly):

   ```bash
   pnpm run format:check
   pnpm run lint
   pnpm run typecheck
   pnpm run test
   pnpm run build
   ```

   > The pre-commit hook (`husky` + `lint-staged`) runs Prettier automatically on staged files — `format:check` above is a full-repo sanity check.

6. **Commit** using Conventional Commits:

   ```
   feat(loyalty-engine): add tier downgrade logic
   fix(notification): handle missing email address gracefully
   docs(readme): update quick start steps
   ```

7. Open a Pull Request against `main`.

## Code Standards

- **TypeScript** — strict mode, no `any`. Use precise union types or generics.
- **No semicolons** unless required by ASI edge cases (comment why).
- **ES modules** — `import`/`export` only.
- **Max function length** — 40 lines. Split if longer.
- **No magic numbers** — use named constants.
- **Decorators** in NestJS services require `experimentalDecorators: true` — use the `@pointflow/typescript-config/nestjs` base config.

## Project Structure

| Directory         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `apps/`           | Next.js applications with a public HTTP port            |
| `services/`       | NestJS microservices (TCP or Kafka — no public port)    |
| `packages/`       | Shared, zero-runtime packages (types, configs, schemas) |
| `infrastructure/` | Docker Compose files and helper scripts                 |

## Good First Issues

Look for issues labelled `good first issue`. Examples of great starter tasks:

- Add a new notification channel (e.g., SMS via Twilio)
- Improve test coverage for `loyalty-engine`
- Write or improve documentation
- Build a widget for the customer portal

## Questions?

Open a [discussion](https://github.com/binkowskidawid/pointflow/discussions) — we are happy to help.
